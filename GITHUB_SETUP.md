# Инструкция по публикации на GitHub

## 1. Создание репозитория на GitHub

1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите кнопку **"New"** или **"+"** → **"New repository"**
3. Заполните форму:
   - **Repository name**: `fraudshield-landing` (или другое название из списка выше)
   - **Description**: `Промо-сайт для инструмента по борьбе с финансовым мошенничеством`
   - Выберите **Public** или **Private**
   - НЕ устанавливайте галочки на "Initialize with README", "Add .gitignore", "Choose a license"
   - Нажмите **"Create repository"**

## 2. Инициализация Git в проекте

Откройте терминал/командную строку в папке проекта и выполните:

```bash
# Инициализация Git
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: FraudShield landing page"

# Добавление удаленного репозитория (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/fraudshield-landing.git

# Отправка на GitHub
git branch -M main
git push -u origin main
```

## 3. Альтернативный способ через GitHub Desktop

1. Установите [GitHub Desktop](https://desktop.github.com/)
2. Откройте GitHub Desktop
3. File → Add Local Repository
4. Выберите папку проекта
5. Нажмите "Publish repository"
6. Введите название: `fraudshield-landing`

## 4. Рекомендуемые настройки репозитория

### Topics (теги) для поиска:
- `landing-page`
- `fraud-detection`
- `financial-security`
- `b2b`
- `html-css-js`
- `responsive-design`

### Описание:
```
Промо-сайт (лендинг) для B2B-инструмента по обнаружению и предотвращению финансового мошенничества. 
Одностраничный сайт с современным дизайном, адаптивной версткой и функционалом захвата лидов.
```

## 5. Файл .gitignore уже создан

Файл `.gitignore` уже добавлен в проект, он исключит ненужные файлы из репозитория.

## 6. Структура файлов для GitHub

Проект готов к публикации, включает:
- ✅ `index.html` - главная страница
- ✅ `styles.css` - стили
- ✅ `script.js` - JavaScript функционал
- ✅ `send-email.php` - пример обработки формы (опционально)
- ✅ `README.md` - документация
- ✅ `.gitignore` - исключения для Git

## 7. GitHub Pages (опционально)

Для размещения сайта на GitHub Pages:

1. В настройках репозитория перейдите в **Settings** → **Pages**
2. В разделе **Source** выберите ветку **main** и папку **/ (root)**
3. Нажмите **Save**
4. Ваш сайт будет доступен по адресу: `https://YOUR_USERNAME.github.io/fraudshield-landing/`

