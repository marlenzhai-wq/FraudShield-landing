<?php
/**
 * Скрипт для обработки формы и отправки email
 * 
 * ИНСТРУКЦИЯ:
 * 1. Укажите ваш email адрес в переменной $to_email
 * 2. Настройте SMTP, если нужно использовать внешний SMTP сервер (вместо mail())
 * 3. Для продакшена рекомендуется использовать библиотеки типа PHPMailer
 */

// Защита от прямого доступа (можно убрать для тестирования)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Email получателя (замените на свой)
$to_email = 'info@fraudshield.ru';

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Метод не разрешен']);
    exit;
}

// Получение данных из POST запроса
$data = json_decode(file_get_contents('php://input'), true);

// Если данные не в JSON формате, попробуем получить из $_POST
if (!$data) {
    $data = $_POST;
}

// Валидация данных
$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$company = isset($data['company']) ? trim($data['company']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';

// Проверка обязательных полей
if (empty($name) || empty($email) || empty($company)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Заполните все обязательные поля']);
    exit;
}

// Валидация email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Некорректный email адрес']);
    exit;
}

// Защита от спама (базовая проверка)
$spam_keywords = ['http://', 'https://', 'www.', 'spam', 'viagra'];
$text_to_check = strtolower($name . ' ' . $email . ' ' . $company . ' ' . $message);
foreach ($spam_keywords as $keyword) {
    if (strpos($text_to_check, $keyword) !== false && strpos($text_to_check, 'http') !== false) {
        // Если есть подозрительные ссылки, проверяем более строго
        if (substr_count($text_to_check, 'http') > 1) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Сообщение отклонено']);
            exit;
        }
    }
}

// Если используется reCAPTCHA (раскомментируйте при настройке)
/*
if (isset($data['g-recaptcha-response']) && !empty($data['g-recaptcha-response'])) {
    $recaptcha_secret = 'YOUR_SECRET_KEY'; // Замените на ваш Secret Key
    $recaptcha_response = $data['g-recaptcha-response'];
    $recaptcha_url = 'https://www.google.com/recaptcha/api/siteverify';
    
    $recaptcha_data = [
        'secret' => $recaptcha_secret,
        'response' => $recaptcha_response,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ];
    
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($recaptcha_data)
        ]
    ];
    
    $context = stream_context_create($options);
    $recaptcha_result = file_get_contents($recaptcha_url, false, $context);
    $recaptcha_json = json_decode($recaptcha_result, true);
    
    if (!$recaptcha_json['success']) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Ошибка проверки reCAPTCHA']);
        exit;
    }
}
*/

// Подготовка email
$subject = 'Новая заявка на демо-доступ - ' . htmlspecialchars($company);
$email_body = "Получена новая заявка на демо-доступ\n\n";
$email_body .= "Имя: " . htmlspecialchars($name) . "\n";
$email_body .= "Email: " . htmlspecialchars($email) . "\n";
$email_body .= "Компания: " . htmlspecialchars($company) . "\n";
if (!empty($message)) {
    $email_body .= "Сообщение: " . htmlspecialchars($message) . "\n";
}
$email_body .= "\n---\n";
$email_body .= "Дата: " . date('d.m.Y H:i:s') . "\n";
$email_body .= "IP адрес: " . $_SERVER['REMOTE_ADDR'] . "\n";

$headers = "From: FraudShield Landing <noreply@fraudshield.ru>\r\n";
$headers .= "Reply-To: " . htmlspecialchars($email) . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Отправка email
$mail_sent = mail($to_email, $subject, $email_body, $headers);

// Альтернатива: отправка через SMTP (рекомендуется для продакшена)
// Используйте PHPMailer или аналогичную библиотеку:
/*
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

$mail = new PHPMailer\PHPMailer\PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = 'smtp.example.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'your-email@example.com';
    $mail->Password = 'your-password';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    
    $mail->setFrom('noreply@fraudshield.ru', 'FraudShield Landing');
    $mail->addAddress($to_email);
    $mail->addReplyTo($email, $name);
    
    $mail->isHTML(false);
    $mail->Subject = $subject;
    $mail->Body = $email_body;
    
    $mail->send();
    $mail_sent = true;
} catch (Exception $e) {
    $mail_sent = false;
    error_log("Mailer Error: {$mail->ErrorInfo}");
}
*/

// Ответ клиенту
if ($mail_sent) {
    // Опционально: сохранение в базу данных или отправка в CRM
    // saveToDatabase($name, $email, $company, $message);
    // sendToCRM($name, $email, $company, $message);
    
    http_response_code(200);
    echo json_encode([
        'success' => true, 
        'message' => 'Спасибо! Мы свяжемся с вами в ближайшее время.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.'
    ]);
}

/**
 * Функция для сохранения в базу данных (пример)
 * Раскомментируйте и настройте при необходимости
 */
/*
function saveToDatabase($name, $email, $company, $message) {
    $servername = "localhost";
    $username = "your_username";
    $password = "your_password";
    $dbname = "your_database";
    
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $stmt = $conn->prepare("INSERT INTO leads (name, email, company, message, created_at) 
                               VALUES (:name, :email, :company, :message, NOW())");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':company', $company);
        $stmt->bindParam(':message', $message);
        $stmt->execute();
        
        $conn = null;
    } catch(PDOException $e) {
        error_log("Database Error: " . $e->getMessage());
    }
}
*/

/**
 * Функция для отправки в CRM (пример для amoCRM)
 * Раскомментируйте и настройте при необходимости
 */
/*
function sendToCRM($name, $email, $company, $message) {
    $amoCRM_domain = 'yourdomain.amocrm.ru';
    $amoCRM_token = 'your_access_token';
    
    $data = [
        [
            'name' => $company . ' - Заявка на демо',
            'custom_fields_values' => [
                [
                    'field_id' => 123456, // ID поля "Имя"
                    'values' => [['value' => $name]]
                ],
                [
                    'field_id' => 123457, // ID поля "Email"
                    'values' => [['value' => $email]]
                ],
                [
                    'field_id' => 123458, // ID поля "Компания"
                    'values' => [['value' => $company]]
                ]
            ],
            '_embedded' => [
                'contacts' => [
                    [
                        'first_name' => $name,
                        'custom_fields_values' => [
                            [
                                'field_id' => 123459, // ID поля "Email" в контакте
                                'values' => [['value' => $email]]
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ];
    
    $ch = curl_init("https://$amoCRM_domain/api/v4/leads");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $amoCRM_token,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
}
*/
?>

