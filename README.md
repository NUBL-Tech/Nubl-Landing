# Nubl Landing Page

Лендинг-страница для планировщика задач Nubl - простого и гибкого инструмента для управления проектами команд.

## 🚀 Деплой на GitHub Pages

### Автоматический деплой через GitHub Actions

1. **Создайте репозиторий на GitHub** с именем `Nubl-Landing`
2. **Загрузите код** в репозиторий:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Nubl-Landing.git
   git push -u origin main
   ```

3. **Включите GitHub Pages**:
   - Перейдите в Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)

4. **Настройте GitHub Actions**:
   - Перейдите в Actions → Deploy to GitHub Pages
   - Нажмите "Run workflow"

### Ручной деплой

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Деплой на GitHub Pages
npm run deploy
```

## 📝 Важные настройки

### Изменение базового URL

Если ваш репозиторий называется по-другому, измените в `vite.config.js`:

```javascript
export default defineConfig({
  base: '/YOUR_REPO_NAME/', // Замените на имя вашего репозитория
  // ...
})
```

### Настройка домена

Если у вас есть собственный домен:

1. Создайте файл `CNAME` в корне проекта:
   ```
   your-domain.com
   ```

2. Добавьте файл в репозиторий:
   ```bash
   echo "your-domain.com" > CNAME
   git add CNAME
   git commit -m "Add CNAME file"
   git push
   ```

3. Настройте DNS записи у вашего провайдера домена

## 🛠️ Разработка

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Предварительный просмотр сборки
npm run preview
```

## 📁 Структура проекта

```
├── index.html              # Главная страница
├── agreement.html           # Согласие на ОПД
├── privacy.html            # Политика конфиденциальности
├── offer.html              # Публичная оферта
├── cookies.html            # Страница о cookies
├── 404.html               # Страница ошибки 404
├── vite.config.js         # Конфигурация Vite
├── package.json           # Зависимости и скрипты
└── src/
    ├── scss/              # Стили (SCSS)
    ├── js/                # JavaScript
    ├── fonts/              # Шрифты Inter
    └── img/               # Изображения и иконки
```

## 🔧 Технологии

- **HTML5** - семантическая разметка
- **SCSS** - стили с препроцессором
- **Vanilla JavaScript** - интерактивность
- **Vite** - сборщик и dev-сервер
- **GitHub Actions** - автоматический деплой

## 📱 Особенности

- ✅ Адаптивный дизайн
- ✅ SEO-оптимизация
- ✅ Структурированные данные Schema.org
- ✅ Анимации при скролле
- ✅ Валидация форм
- ✅ Мобильное меню
- ✅ Обработка cookies
- ✅ Плавная прокрутка

## 🌐 Ссылки

- **Сайт**: https://YOUR_USERNAME.github.io/Nubl-Landing/
- **Репозиторий**: https://github.com/YOUR_USERNAME/Nubl-Landing

---

**Nubl** - Быстрый планировщик задач для команд
