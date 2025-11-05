// * data-ani =============================================================

// Функция для проверки видимости элемента по разным критериям
function isElementInViewport(el, type) {
    // Проверяем, существует ли элемент
    if (!el || !el.getBoundingClientRect) {
        return false;
    }

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Проверяем, что элемент имеет размеры
    if (rect.width === 0 && rect.height === 0) {
        return false;
    }

    switch (type) {
        case 'ani':
            // Для data-ani - появляется при 80% от высоты окна (когда элемент почти виден)
            return rect.top <= windowHeight * 0.8 && rect.bottom >= 0;

        case 'ani-center':
            // Для data-ani-center - появляется когда элемент на 150px от верха экрана
            return rect.top <= windowHeight * 0.45 && rect.bottom >= 0;

        case 'ani-bottom':
            // Для data-ani-bottom - появляется когда элемент в нижней части экрана
            return rect.bottom <= windowHeight + 100 && rect.bottom >= windowHeight - 200;

        default:
            return false;
    }
}

// Функция для обработки анимаций
function handleAnimations() {
    // Обработка data-ani
    const aniElements = document.querySelectorAll('[data-ani]');
    if (aniElements && aniElements.length > 0) {
        aniElements.forEach(el => {
            // Проверяем существование элемента
            if (!el) return;

            if (!el.classList.contains('visible')) {
                // Проверяем, есть ли у атрибута значение
                const customClass = el.getAttribute('data-ani');
                if (customClass && customClass !== '') {
                    if (isElementInViewport(el, 'ani')) {
                        el.classList.add(customClass);
                        el.classList.add('animate');
                    }
                } else {
                    if (isElementInViewport(el, 'ani')) {
                        el.classList.add('visible');
                    }
                }
            }
        });
    }

    // Обработка data-ani-center
    const aniCenterElements = document.querySelectorAll('[data-ani-center]');
    if (aniCenterElements && aniCenterElements.length > 0) {
        aniCenterElements.forEach(el => {
            // Проверяем существование элемента
            if (!el) return;

            if (!el.classList.contains('visible-center')) {
                // Проверяем, есть ли у атрибута значение
                const customClass = el.getAttribute('data-ani-center');
                if (customClass && customClass !== '') {
                    if (isElementInViewport(el, 'ani-center')) {
                        el.classList.add(customClass);
                        el.classList.add('animate');
                    }
                } else {
                    if (isElementInViewport(el, 'ani-center')) {
                        el.classList.add('visible-center');
                    }
                }
            }
        });
    }

    // Обработка data-ani-bottom
    const aniBottomElements = document.querySelectorAll('[data-ani-bottom]');
    if (aniBottomElements && aniBottomElements.length > 0) {
        aniBottomElements.forEach(el => {
            // Проверяем существование элемента
            if (!el) return;

            if (!el.classList.contains('visible-bottom')) {
                // Проверяем, есть ли у атрибута значение
                const customClass = el.getAttribute('data-ani-bottom');
                if (customClass && customClass !== '') {
                    if (isElementInViewport(el, 'ani-bottom')) {
                        el.classList.add(customClass);
                        el.classList.add('animate');
                    }
                } else {
                    if (isElementInViewport(el, 'ani-bottom')) {
                        el.classList.add('visible-bottom');
                    }
                }
            }
        });
    }
}

// Добавляем обработчики событий
document.addEventListener('DOMContentLoaded', function () {
    // Запускаем проверку при загрузке страницы
    handleAnimations();

    // Добавляем обработчики для кросс-браузерной совместимости
    let ticking = false;

    function updateAnimations() {
        handleAnimations();
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }

    // Обработчики событий для разных браузеров с проверками
    if (window.addEventListener) {
        window.addEventListener('scroll', requestTick, { passive: true });
        window.addEventListener('resize', requestTick, { passive: true });
        window.addEventListener('orientationchange', requestTick, { passive: true });
    }

    // Для Safari и мобильных устройств
    if (document.addEventListener) {
        document.addEventListener('touchmove', requestTick, { passive: true });
    }
});

// Дополнительная проверка для Safari при изменении размеров
if (window.addEventListener) {
    window.addEventListener('resize', function () {
        setTimeout(handleAnimations, 100);
    });
}

// Функция для ручного запуска анимаций (на случай необходимости)
function triggerAnimations() {
    if (typeof handleAnimations === 'function') {
        handleAnimations();
    }
}
// * аккордеон =============================================================================================================================================================================================

// Проверка на Safari

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', function () {
    // Добавляем класс safari-accordion для всех faq-row в Safari
    if (isSafari) {
        document.querySelectorAll('.faq-row').forEach(row => {
            row.classList.add('safari-accordion');
        });
    }

    // Инициализация аккордеона
    const headers = document.querySelectorAll('.faq-row__actions');
    headers.forEach(header => {
        header.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const isOpen = content.classList.contains('open');

            // Закрываем все аккордеоны
            document.querySelectorAll('.faq-row__body').forEach(body => {
                body.style.maxHeight = null;
                body.classList.remove('open');
                body.previousElementSibling.classList.remove('active');
            });

            // Открываем текущий аккордеон
            if (!isOpen) {
                // В Safari НЕ используем maxHeight
                if (!isSafari) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
                content.classList.add('open');
                this.classList.add('active');
            }
        });
    });
});


// *форм =============================================================================================================================================================================================

// Для всех элементов формы
document.querySelectorAll('.form-block__item').forEach(item => {
    const input = item.querySelector('input, textarea');
    const label = item.querySelector('label');
    if (input && label) {
        // При клике на label
        label.addEventListener('click', () => {
            item.classList.add('active');
            input.focus();
        });
        // При фокусе на input/textarea
        input.addEventListener('focus', () => {
            item.classList.add('active');
        });
        // При потере фокуса
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                item.classList.remove('active');
                item.classList.remove('show'); // Удаляем класс show, если поле пустое
            } else {
                item.classList.add('show'); // Добавляем класс show, если поле заполнено
            }
            // Проверка email при потере фокуса (только для email поля)
            if (input.type === 'email') {
                validateEmailField(input, item);
            }
        });
        // При вводе текста (для динамической проверки)
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                item.classList.add('active');
                item.classList.add('show'); // Добавляем класс show, если поле заполнено
            } else {
                item.classList.remove('active');
                item.classList.remove('show'); // Удаляем класс show, если поле пустое
            }
            // Удаляем ошибку при вводе текста
            if (input.type === 'email') {
                item.classList.remove('error');
            }
        });
        // Инициализация при загрузке страницы
        if (input.value.trim() !== '') {
            item.classList.add('active');
            item.classList.add('show'); // Добавляем класс show, если поле заполнено
        }
    }
});

// Остальные функции остаются без изменений
function validateEmailField(input, item) {
    if (input.value.trim() !== '') {
        if (!input.checkValidity() || !isValidEmail(input.value)) {
            item.classList.add('error');
        } else {
            item.classList.remove('error');
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Обработка отправки формы
document.addEventListener('submit', function (e) {
    const form = e.target;
    if (form.classList.contains('your-form-class') || form.querySelector('.form-block__item')) {
        const emailInputs = form.querySelectorAll('input[type="email"]');
        let hasErrors = false;
        emailInputs.forEach(input => {
            const item = input.closest('.form-block__item');
            if (item) {
                if (!input.checkValidity() || !isValidEmail(input.value)) {
                    item.classList.add('error');
                    hasErrors = true;
                } else {
                    item.classList.remove('error');
                }
            }
        });
        if (hasErrors) {
            e.preventDefault();
            const firstErrorItem = form.querySelector('.form-block__item.error');
            if (firstErrorItem) {
                firstErrorItem.querySelector('input, textarea').focus();
            }
        }
    }
});


// * задаем высоту для textarea =============================================================================================================================================================================================

const textarea = document.getElementById('inp2');

if (textarea) {

    textarea.addEventListener('input', function () {
        this.style.height = 'auto';

        if (this.value.trim() === '') {
            this.style.height = '100%';
        } else {
            this.style.height = Math.min(this.scrollHeight, 330) + 'px';
        }
    });

    // При фокусе увеличиваем до нужного размера
    textarea.addEventListener('focus', function () {
        if (this.value.trim() !== '') {
            // this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 330) + 'px';
        }
    });
}

// * check-mark =============================================================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {
    const checkMarks = document.querySelectorAll('.check-mark');

    if (checkMarks.length > 0) {
        checkMarks.forEach(item => {
            const input = item.querySelector('input');

            if (input) {
                input.addEventListener('change', function () {
                    if (this.checked) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }
});

// * год =============================================================================================================================================================================================

const yearElements = document.querySelectorAll('.current-year');
yearElements.forEach(element => {
    element.textContent = new Date().getFullYear();
});


// * задает задержку для .signup-text-decor span =============================================================================================================================================================================================

const signupDecors = document.querySelectorAll('.signup-text-decor span')
if (signupDecors) {
    signupDecors.forEach((signupDecor, el) => {
        signupDecor.style.transitionDelay = `${el * 80}ms`
    })
}

// * анимация для мыши =============================================================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {
    const mouseElement = document.querySelector('.mouse');
    const decorElement = document.querySelector('.decor');
    const blocks = document.querySelectorAll('.block-shadow-inset');

    document.addEventListener('mousemove', function (e) {
        const x = e.clientX;
        const y = e.clientY;

        // Позиционировать mouse элемент по центру
        mouseElement.style.left = x + 'px';
        mouseElement.style.top = y + 'px';
        mouseElement.style.transform = 'translate(-50%, -50%)';

        // Создать clip-path для показа декора только в области mouse
        const clipPath = `circle(185px at ${x}px ${y}px)`;
        decorElement.style.clipPath = clipPath;
        decorElement.style.opacity = 1;

        // Получаем размеры body
        const bodyRect = document.body.getBoundingClientRect();

        // Нормализуем координаты (от -0.5 до +0.5)
        const normX = (x / bodyRect.width) - 0.3;
        const normY = (y / bodyRect.height) - 0.3;

        // Инвертируем направление и ограничиваем диапазон (-10px … +10px)
        const offsetX = -(normX * 10);
        const offsetY = -(normY * 10);

        // Применяем эффект ко всем блокам
        blocks.forEach(block => {
            block.style.boxShadow = `inset ${offsetX.toFixed(2)}px ${offsetY.toFixed(2)}px 20px 0 rgba(255, 255, 255, 1)`;
        });
    });

    // сброс начального состояния для всех блоков
    blocks.forEach(block => {
        block.style.boxShadow = 'inset 0 0 20px 0 #fff';
    });
});


// * burger =============================================================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {
    // Получаем все необходимые элементы
    const burger = document.querySelector('.burger');
    const menuItems = document.querySelectorAll('.menu__item');
    const overlap = document.querySelector('.overlap');
    const logo = document.querySelector('.logo');
    const btnHeader = document.querySelector('.btn-header');
    const menuMob = document.querySelector('.menu-mob');
    const menuList = document.querySelector('.menu-mob .menu__list');
    const body = document.body;

    // Функция для вычисления и установки высоты menu-mob
    function setMenuHeight() {
        if (body.classList.contains('menu-show') && menuMob && menuList) {
            // Если меню открыто - вычисляем высоту
            const menuListHeight = menuList.offsetHeight;
            const menuMobHeight = menuMob.offsetHeight;
            const totalHeight = menuListHeight + menuMobHeight;

            // Устанавливаем высоту (можно использовать style.height или добавить data-атрибут)
            menuMob.style.height = totalHeight + 'px';
        } else if (menuMob) {
            // Если меню закрыто - сбрасываем высоту
            menuMob.style.height = '';
        }
    }

    // Функция для переключения класса menu-show
    function toggleMenu() {
        body.classList.toggle('menu-show');
        // Немного задержки для корректного расчета высоты
        setTimeout(setMenuHeight, 10);
    }

    // Функция для удаления класса menu-show
    function hideMenu() {
        body.classList.remove('menu-show');
        // Немного задержки для корректного расчета высоты
        setTimeout(setMenuHeight, 10);
    }

    // Обработчик клика на burger
    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    // Обработчики клика на menu__item
    menuItems.forEach(item => {
        item.addEventListener('click', hideMenu);
    });

    // Обработчик клика на overlap
    if (overlap) {
        overlap.addEventListener('click', hideMenu);
    }

    // Обработчик клика на logo
    if (logo) {
        logo.addEventListener('click', hideMenu);
    }

    // Обработчик клика на btn-header
    if (btnHeader) {
        btnHeader.addEventListener('click', hideMenu);
    }

    // Опционально: отслеживаем изменение размеров окна
    window.addEventListener('resize', function () {
        if (body.classList.contains('menu-show')) {
            setMenuHeight();
        }
    });
});

// * ссылка для копирования =============================================================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {
    const socialLink = document.querySelector('.social-item-link');
    if (socialLink) {
        socialLink.addEventListener('click', function (event) {
            event.preventDefault();
            const linkToCopy = this.getAttribute('data-link')?.trim();

            if (linkToCopy) {
                navigator.clipboard.writeText(linkToCopy)
                    .then(function () {
                        console.log('Ссылка скопирована: ' + linkToCopy);
                    })
                    .catch(function (error) {
                        console.error('Ошибка копирования: ', error);
                    });

                const popup = this.closest('.popup');
                if (popup) {
                    popup.classList.add('link');
                    setTimeout(() => {
                        popup.classList.remove('link');
                    }, 3000); // Удаляем класс через 3 секунды
                }
            }
        });
    }
});




// * cookie =============================================================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {
    const cookieBanner = document.querySelector('.cookie');
    const acceptButton = document.querySelector('.btn-cookie');

    // Проверяем, принимал ли пользователь куки ранее
    function checkCookieConsent() {
        return localStorage.getItem('cookiesAccepted') === 'true';
    }

    // Показываем или скрываем баннер
    function toggleCookieBanner() {
        // Проверяем существование элемента перед использованием
        if (cookieBanner) {
            if (checkCookieConsent()) {
                cookieBanner.style.display = 'none';
            } else {
                cookieBanner.style.display = 'block';
            }
        }
    }

    // Принимаем куки
    function acceptCookies() {
        localStorage.setItem('cookiesAccepted', 'true');

        // Проверяем существование элемента перед использованием
        if (cookieBanner) {
            cookieBanner.style.display = 'none';
        }

        // Здесь можно добавить код для включения аналитики и других сервисов
        console.log('Cookies accepted');
    }

    // Назначаем обработчик события только если кнопка существует
    if (acceptButton) {
        acceptButton.addEventListener('click', acceptCookies);
    }

    // Инициализируем баннер
    toggleCookieBanner();
});

// * якорная ссылка =============================================================================================================================================================================================

// Высота фиксированной шапки
const HEADER_HEIGHT = 0;

// Функция плавной прокрутки
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - HEADER_HEIGHT;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Обработка кликов по якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        smoothScrollTo(targetId);
    });
});

// Проверка якоря в URL при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            smoothScrollTo(hash);
        }, 100); // Небольшая задержка, чтобы DOM полностью загрузился
    }
});



