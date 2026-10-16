document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. АНИМАЦИЯ ОТКРЫТИЯ ДВЕРЕЙ ПРИ ЗАГРУЗКЕ ---
    const doors = document.getElementById("elevator-doors");
    if (doors) {
        setTimeout(() => { doors.classList.add("open"); }, 300);
    }

    // --- 2. ЛОГИКА ЛИФТА (КНОПКИ И СКРОЛЛ) ---
    const floorDisplay = document.getElementById("floor-display");
    const dirArrow = document.getElementById("dir-arrow");
    const floorBtns = document.querySelectorAll(".floor-btn");
    const isHomePage = document.getElementById("hero") !== null;
    // Без анимации дверей: пользователь просил меньше движения
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const doorDelay = reduceMotion || !doors ? 0 : 1500;

    floorBtns.forEach(btn => {
        btn.addEventListener("click", function(e) {
            // Ctrl/Cmd/Shift-клик и средняя кнопка — открыть в новой вкладке как обычно
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            const targetId = this.getAttribute("data-target");
            const targetSec = document.getElementById(targetId);
            const href = this.getAttribute("href");

            if (doors) doors.classList.remove("open"); // Закрываем двери

            if (isHomePage && targetSec) {
                setTimeout(() => {
                    window.scrollTo({ top: targetSec.offsetTop, behavior: "instant" });
                    if (floorDisplay) floorDisplay.textContent = btn.getAttribute("data-floor");
                    floorBtns.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    if (doors) setTimeout(() => { doors.classList.add("open"); }, 100);
                }, doorDelay);
            } else {
                setTimeout(() => { window.location.href = href; }, doorDelay);
            }
        });
    });

    if (isHomePage) {
        let lastScrollY = window.scrollY;
        const sections = Array.from(floorBtns).map(btn => document.getElementById(btn.getAttribute("data-target"))).filter(Boolean);

        window.addEventListener("scroll", () => {
            let currentScroll = window.scrollY;
            
            if (dirArrow && currentScroll > lastScrollY) dirArrow.textContent = "▼";
            else if (dirArrow && currentScroll < lastScrollY) dirArrow.textContent = "▲";
            lastScrollY = currentScroll;

            let currentSectionId = "";
            sections.forEach(sec => {
                const secTop = sec.offsetTop - (window.innerHeight / 3); 
                if (currentScroll >= secTop) currentSectionId = sec.getAttribute("id");
            });

            if (currentSectionId) {
                floorBtns.forEach(btn => {
                    btn.classList.remove("active");
                    if (btn.getAttribute("data-target") === currentSectionId) {
                        btn.classList.add("active");
                        if (floorDisplay) floorDisplay.textContent = btn.getAttribute("data-floor");
                        
                        // Центрируем активную кнопку в мобильной панели (если есть прокрутка)
                        if (window.innerWidth <= 900) {
                            btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                        }
                    }
                });
            }
        }, { passive: true });
    }

    // --- 3. ПОДСВЕТКА УСЛУГ (SERVICES) ПРИ СКРОЛЛЕ НА МОБИЛЬНЫХ ---
    // Это заменяет :hover на телефонах
    const services = document.querySelectorAll('.svc');
    if (services.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Если блок услуги попал в центр экрана
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-active');
                } else {
                    entry.target.classList.remove('scroll-active');
                }
            });
        }, {
            root: null,
            rootMargin: '-30% 0px -30% 0px', // Срабатывает, когда элемент в центре
            threshold: 0
        });

        services.forEach(svc => observer.observe(svc));
    }

    // --- 4. МОБИЛЬНОЕ МЕНЮ (БУРГЕР) ---
    const burger = document.getElementById("burger");
    const mobileMenu = document.getElementById("mobileMenu");
    
    if (burger && mobileMenu) {
        const setMenuOpen = (open) => {
            burger.classList.toggle("active", open);
            mobileMenu.classList.toggle("open", open);
            burger.setAttribute("aria-expanded", String(open));
            // Блокируем скролл фона, когда меню открыто
            document.body.style.overflow = open ? "hidden" : "";
        };

        burger.addEventListener("click", () => setMenuOpen(!mobileMenu.classList.contains("open")));
        // Закрываем меню при клике на ссылку внутри него
        mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenuOpen(false)));
        // ...и при повороте/зуме, иначе оно виснет поверх уже десктопной раскладки
        window.addEventListener("resize", () => { if (window.innerWidth > 900) setMenuOpen(false); });
    }
});
