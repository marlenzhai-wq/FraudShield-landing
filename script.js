// Smooth scroll для якорных ссылок
document.addEventListener('DOMContentLoaded', function() {
    // Обработка якорных ссылок
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Игнорируем пустые якоря и #header
            if (href === '#' || href === '#header') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            
            // Специальная обработка для политики конфиденциальности
            if (targetId === 'privacy-policy') {
                e.preventDefault();
                showPrivacyPolicy();
                return;
            }
            
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Закрываем мобильное меню, если открыто
                const nav = document.getElementById('nav');
                const menuToggle = document.getElementById('menuToggle');
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
                
                // Вычисляем позицию с учетом фиксированного хедера
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Мобильное меню
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
    
    // Изменение стиля хедера при прокрутке
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Exit-intent popup (срабатывает при попытке уйти со страницы)
    let exitIntentShown = false;
    const exitPopup = document.getElementById('exitPopup');
    
    // Отслеживаем движение мыши к верхней части экрана (выход)
    document.addEventListener('mouseout', function(e) {
        if (!exitIntentShown && exitPopup) {
            // Проверяем, что мышь действительно покинула окно браузера
            if (!e.toElement && !e.relatedTarget && e.clientY < 10) {
                exitIntentShown = true;
                exitPopup.classList.add('active');
                
                // Сохраняем флаг в localStorage, чтобы не показывать повторно в этой сессии
                sessionStorage.setItem('exitIntentShown', 'true');
            }
        }
    });
    
    // Проверяем, показывали ли мы уже попап в этой сессии
    if (sessionStorage.getItem('exitIntentShown') === 'true') {
        exitIntentShown = true;
    }
});

// Функция прокрутки к форме CTA
function scrollToCTA() {
    try {
        const ctaSection = document.getElementById('cta');
        if (ctaSection) {
            const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
            const targetPosition = ctaSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Фокус на первое поле формы через небольшую задержку
            setTimeout(() => {
                const nameInput = document.getElementById('name');
                if (nameInput) {
                    nameInput.focus();
                }
            }, 500);
        } else {
            console.error('CTA section not found');
        }
    } catch (error) {
        console.error('Error in scrollToCTA:', error);
    }
}

// Функция для открытия видео на YouTube
function openYouTubeVideo() {
    try {
        // Открываем видео на YouTube в новой вкладке
        window.open('https://www.youtube.com/watch?v=Y1Q1NLQ8wfo', '_blank');
    } catch (error) {
        console.error('Error in openYouTubeVideo:', error);
    }
}

// Функции для работы с видео модальным окном (оставлены для совместимости, если понадобятся)
function openVideoModal() {
    // Теперь просто открываем YouTube
    openYouTubeVideo();
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Возвращаем прокрутку
    }
}

// Закрытие модального окна при клике вне его
document.addEventListener('DOMContentLoaded', function() {
    const videoModal = document.getElementById('videoModal');
    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
            closeExitPopup();
        }
    });
});

// Функция закрытия exit-intent попапа
function closeExitPopup() {
    try {
        const exitPopup = document.getElementById('exitPopup');
        if (exitPopup) {
            exitPopup.classList.remove('active');
        }
    } catch (error) {
        console.error('Error in closeExitPopup:', error);
    }
}

// Функции для работы с политикой конфиденциальности
function showPrivacyPolicy() {
    const privacySection = document.getElementById('privacy-policy');
    if (privacySection) {
        privacySection.style.display = 'block';
        privacySection.scrollIntoView({ behavior: 'smooth' });
    }
}

function closePrivacyPolicy() {
    const privacySection = document.getElementById('privacy-policy');
    if (privacySection) {
        privacySection.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Закрытие exit popup при клике вне его
document.addEventListener('DOMContentLoaded', function() {
    const exitPopup = document.getElementById('exitPopup');
    if (exitPopup) {
        exitPopup.addEventListener('click', function(e) {
            if (e.target === exitPopup) {
                closeExitPopup();
            }
        });
    }
});

// Обработка формы
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formMessage = document.getElementById('formMessage');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Получаем данные формы
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        company: document.getElementById('company').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormMessage('Пожалуйста, введите корректный email адрес', 'error');
        return;
    }
    
    // Блокируем кнопку отправки
    submitButton.disabled = true;
    submitButton.textContent = 'Отправка...';
    
    // Здесь должна быть интеграция с вашим бэкендом или CRM
    // Пример отправки через Fetch API:
    
    // Вариант 1: Отправка на email через PHP скрипт (нужно создать send-email.php)
    // fetch('send-email.php', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     if (data.success) {
    //         showFormMessage('Спасибо! Мы свяжемся с вами в ближайшее время.', 'success');
    //         form.reset();
    //     } else {
    //         showFormMessage('Произошла ошибка. Пожалуйста, попробуйте позже.', 'error');
    //     }
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    //     showFormMessage('Произошла ошибка. Пожалуйста, попробуйте позже.', 'error');
    // })
    // .finally(() => {
    //     submitButton.disabled = false;
    //     submitButton.textContent = 'Заказать демо';
    // });
    
    // Вариант 2: Интеграция с amoCRM (пример)
    // Для этого нужно подключить amoCRM API и настроить вебхук
    
    // Вариант 3: Временная заглушка (для демонстрации)
    // В реальном проекте это нужно заменить на реальную отправку
    setTimeout(() => {
        // Имитация успешной отправки
        console.log('Form data:', formData);
        
        // Отправка через mailto (временное решение)
        const subject = encodeURIComponent('Запрос на демо-доступ - ' + formData.company);
        const body = encodeURIComponent(
            `Имя: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Компания: ${formData.company}\n` +
            `Сообщение: ${formData.message || 'Нет дополнительной информации'}`
        );
        
        // Можно использовать mailto как временное решение
        // window.location.href = `mailto:info@fraudshield.ru?subject=${subject}&body=${body}`;
        
        showFormMessage('Спасибо за интерес! Мы свяжемся с вами в ближайшее время.', 'success');
        form.reset();
        
        // Сбрасываем флаг exit-intent для возможности повторного показа
        sessionStorage.removeItem('exitIntentShown');
        
        // Закрываем exit popup, если он открыт
        closeExitPopup();
        
        submitButton.disabled = false;
        submitButton.textContent = 'Заказать демо';
        
        // Отправка события в аналитику (если настроена)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Lead',
                'event_label': 'Demo Request'
            });
        }
        
        if (typeof ym !== 'undefined') {
            ym(XXXXXX, 'reachGoal', 'form_submit');
        }
    }, 1000);
}

// Функция показа сообщения формы
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        
        // Автоматически скрываем сообщение через 5 секунд
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
        
        // Прокручиваем к сообщению
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Анимация появления элементов при прокрутке (Intersection Observer)
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Применяем анимацию к карточкам
    const animatedElements = document.querySelectorAll(
        '.risk-item, .advantage-card, .industry-card, .stat-card, .step-item'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Валидация формы в реальном времени
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (this.value && !emailRegex.test(this.value)) {
                this.style.borderColor = '#EF4444';
            } else {
                this.style.borderColor = '';
            }
        });
        
        emailInput.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(239, 68, 68)') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(this.value)) {
                    this.style.borderColor = '';
                }
            }
        });
    }
    
    // Дополнительная привязка обработчиков для кнопок (на случай проблем с onclick)
    const demoButtons = document.querySelectorAll('[onclick*="scrollToCTA"]');
    demoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToCTA();
        });
    });
    
    const videoButtons = document.querySelectorAll('[onclick*="openVideoModal"]');
    videoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openVideoModal();
        });
    });
    
    const closeModalButtons = document.querySelectorAll('[onclick*="closeVideoModal"]');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            closeVideoModal();
        });
    });
    
    const closeExitButtons = document.querySelectorAll('[onclick*="closeExitPopup"]');
    closeExitButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            closeExitPopup();
        });
    });
    
    const closePrivacyButtons = document.querySelectorAll('[onclick*="closePrivacyPolicy"]');
    closePrivacyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            closePrivacyPolicy();
        });
    });
});

