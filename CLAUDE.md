# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## О проекте

Лендинг-страница для планировщика задач Nubl. Статический сайт на чистом HTML/SCSS/JavaScript с Vite в качестве сборщика.

## Команды разработки

```bash
npm install      # Установка зависимостей
npm run dev      # Запуск dev-сервера (порт 3000, автоматически открывает браузер)
npm run build    # Сборка проекта + генерация sitemap
npm run preview  # Предварительный просмотр сборки
npm run deploy   # Сборка + деплой на GitHub Pages через gh-pages
```

## Архитектура

### Структура страниц

Проект использует multi-page подход через Vite:
- `index.html` — главная страница
- `legal.html` — общая юридическая страница
- `legal/*.html` — отдельные юридические документы (agreement, cookies, offer, privacy)
- `404.html` — страница ошибки

Все HTML-файлы явно указаны в `vite.config.js` → `rollupOptions.input`.

### Стили (SCSS)

Точка входа: `src/scss/style.scss`

Организация:
- `base/mixins.scss` — SCSS миксины (включая `rem()` и `em()` функции)
- `base/null.scss` — reset стилей
- Остальные файлы — компонентные стили (header, footer, home, popup, cookie, ui)

CSS-переменные определены в `:root` в style.scss (цвета, line-height, border-radius).

### JavaScript

- `src/js/main.js` — основная логика: scroll-анимации (`data-ani`, `data-ani-center`, `data-ani-bottom`), аккордеон FAQ, формы, мобильное меню, cookies-баннер, якорная навигация
- `src/js/api.js` — отправка формы на API (`/api/v1/submissions`)

### Анимации при скролле

Используются data-атрибуты для автоматической анимации:
- `data-ani` — появление при 80% от высоты окна
- `data-ani-center` — появление в центре экрана
- `data-ani-bottom` — появление в нижней части экрана

### Переменные окружения

Настраиваются через `.env` файл или build-args в Docker:

- `VITE_BASE_DOMAIN` — базовый домен сайта (используется в meta-тегах, canonical, sitemap, robots.txt). В HTML используется плейсхолдер `%%VITE_BASE_DOMAIN%%`
- `VITE_HOST` — базовый URL для API запросов

## Деплой

### Docker (основной)

Сборка через GitHub Actions (.github/workflows/deploy.yml).

Переменные `VITE_BASE_DOMAIN` и `VITE_HOST` настраиваются через GitHub Repository Variables.

Образ публикуется в GitHub Container Registry: `ghcr.io/nubl-tech/concent-service/frontend`

### GitHub Pages (альтернативный)

```bash
npm run deploy
```

## Особенности

- Адаптивные брейкпоинты: tablet (991.98px), mobile (767.98px), mobileSmall (479.98px)
- Safari-специфичные фиксы для аккордеона (класс `safari-accordion`)
- Интерактивный эффект мыши с clip-path на `.decor` элементе
- Sitemap и robots.txt генерируются автоматически при сборке (`scripts/generate-sitemap.js`)