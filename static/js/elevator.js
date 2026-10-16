// // document.addEventListener("DOMContentLoaded", () => {
    
// //     const doors = document.getElementById("elevator-doors");
// //     const floorDisplay = document.getElementById("floor-display");
// //     const dirArrow = document.getElementById("dir-arrow");
// //     const floorBtns = document.querySelectorAll(".floor-btn");
    
// //     // Проверяем, на главной ли мы странице (есть ли блок hero)
// //     const isHomePage = document.getElementById("hero") !== null;

// //     // 1. АНИМАЦИЯ ОТКРЫТИЯ ДВЕРЕЙ ПРИ ЗАГРУЗКЕ САЙТА
// //     if (doors) {
// //         setTimeout(() => {
// //             doors.classList.add("open");
// //         }, 300);
// //     }

// //     // 2. ЛОГИКА НАЖАТИЯ НА КНОПКИ ЛИФТА (С ЗАКРЫТИЕМ ДВЕРЕЙ)
// //     floorBtns.forEach(btn => {
// //         btn.addEventListener("click", function(e) {
// //             e.preventDefault(); // Останавливаем стандартный переход
            
// //             const targetId = this.getAttribute("data-target");
// //             const targetSec = document.getElementById(targetId);
// //             const href = this.getAttribute("href");

// //             // Закрываем двери лифта
// //             if (doors) doors.classList.remove("open");

// //             // Если мы УЖЕ на главной странице
// //             if (isHomePage && targetSec) {
// //                 // Ждем 1.2 секунды (пока закроются двери)
// //                 setTimeout(() => {
// //                     // Перемещаемся на нужный блок без плавной прокрутки (эффект телепортации лифта)
// //                     window.scrollTo({ top: targetSec.offsetTop, behavior: "instant" });
                    
// //                     // Обновляем дисплей
// //                     if (floorDisplay) floorDisplay.textContent = btn.getAttribute("data-floor");
// //                     floorBtns.forEach(b => b.classList.remove("active"));
// //                     btn.classList.add("active");

// //                     // Снова открываем двери
// //                     setTimeout(() => { doors.classList.add("open"); }, 200);
// //                 }, 1200);
// //             } 
// //             // Если мы НА ДРУГОЙ СТРАНИЦЕ (например, внутри проекта)
// //             else {
// //                 // Ждем закрытия дверей и переходим на главную по ссылке
// //                 setTimeout(() => {
// //                     window.location.href = href;
// //                 }, 1200);
// //             }
// //         });
// //     });

// //     // 3. ОТСЛЕЖИВАНИЕ ОБЫЧНОГО СКРОЛЛА (ТОЛЬКО ДЛЯ ГЛАВНОЙ)
// //     if (isHomePage) {
// //         let lastScrollY = window.scrollY;
        
// //         // Собираем секции
// //         const sections = [];
// //         floorBtns.forEach(btn => {
// //             const sec = document.getElementById(btn.getAttribute("data-target"));
// //             if (sec) sections.push(sec);
// //         });

// //         window.addEventListener("scroll", () => {
// //             let currentScroll = window.scrollY;
            
// //             // Мигание стрелочки направления
// //             if (currentScroll > lastScrollY) {
// //                 dirArrow.textContent = "▼";
// //             } else if (currentScroll < lastScrollY) {
// //                 dirArrow.textContent = "▲";
// //             }
// //             lastScrollY = currentScroll;

// //             // Определяем текущий этаж
// //             let currentSectionId = "";
// //             sections.forEach(sec => {
// //                 const secTop = sec.offsetTop - (window.innerHeight / 3); 
// //                 if (currentScroll >= secTop) {
// //                     currentSectionId = sec.getAttribute("id");
// //                 }
// //             });

// //             // Обновляем активную кнопку и табло
// //             if (currentSectionId) {
// //                 floorBtns.forEach(btn => {
// //                     btn.classList.remove("active");
// //                     if (btn.getAttribute("data-target") === currentSectionId) {
// //                         btn.classList.add("active");
// //                         if (floorDisplay) {
// //                             floorDisplay.textContent = btn.getAttribute("data-floor");
// //                         }
// //                     }
// //                 });
// //             }
// //         });
// //     }
// // });

// document.addEventListener("DOMContentLoaded", () => {
    
//     const doors = document.getElementById("elevator-doors");
//     const floorDisplay = document.getElementById("floor-display");
//     const dirArrow = document.getElementById("dir-arrow");
//     const floorBtns = document.querySelectorAll(".floor-btn");
    
//     // Проверяем, на главной ли мы странице
//     const isHomePage = document.getElementById("hero") !== null;

//     // 1. ОТКРЫТИЕ ДВЕРЕЙ ПРИ ЗАГРУЗКЕ
//     if (doors) {
//         setTimeout(() => {
//             doors.classList.add("open");
//         }, 300);
//     }

//     // 2. ЛОГИКА НАЖАТИЯ КНОПОК
//     floorBtns.forEach(btn => {
//         btn.addEventListener("click", function(e) {
//             e.preventDefault(); 
            
//             const targetId = this.getAttribute("data-target");
//             const targetSec = document.getElementById(targetId);
//             const href = this.getAttribute("href");

//             // Закрываем двери лифта
//             if (doors) doors.classList.remove("open");

//             // Если мы УЖЕ на главной странице
//             if (isHomePage && targetSec) {
//                 // Ждем РОВНО 1.5 СЕКУНДЫ (пока полностью закроются двери)
//                 setTimeout(() => {
//                     // Перемещаемся на нужный блок мгновенно
//                     window.scrollTo({ top: targetSec.offsetTop, behavior: "instant" });
                    
//                     // Обновляем дисплей
//                     if (floorDisplay) floorDisplay.textContent = btn.getAttribute("data-floor");
//                     floorBtns.forEach(b => b.classList.remove("active"));
//                     btn.classList.add("active");

//                     // Снова открываем двери (с крошечной задержкой после скролла)
//                     setTimeout(() => { doors.classList.add("open"); }, 100);
//                 }, 1500); // Исправлено: 1500мс вместо 1200мс
//             } 
//             // Если мы НА ДРУГОЙ СТРАНИЦЕ
//             else {
//                 // Ждем полного закрытия дверей и переходим по ссылке
//                 setTimeout(() => {
//                     window.location.href = href;
//                 }, 1500); // Исправлено: 1500мс
//             }
//         });
//     });

//     // 3. ОТСЛЕЖИВАНИЕ СКРОЛЛА (ТОЛЬКО НА ГЛАВНОЙ)
//     if (isHomePage) {
//         let lastScrollY = window.scrollY;
        
//         const sections = [];
//         floorBtns.forEach(btn => {
//             const sec = document.getElementById(btn.getAttribute("data-target"));
//             if (sec) sections.push(sec);
//         });

//         window.addEventListener("scroll", () => {
//             let currentScroll = window.scrollY;
            
//             if (currentScroll > lastScrollY) {
//                 dirArrow.textContent = "▼";
//             } else if (currentScroll < lastScrollY) {
//                 dirArrow.textContent = "▲";
//             }
//             lastScrollY = currentScroll;

//             let currentSectionId = "";
//             sections.forEach(sec => {
//                 const secTop = sec.offsetTop - (window.innerHeight / 3); 
//                 if (currentScroll >= secTop) {
//                     currentSectionId = sec.getAttribute("id");
//                 }
//             });

//             if (currentSectionId) {
//                 floorBtns.forEach(btn => {
//                     btn.classList.remove("active");
//                     if (btn.getAttribute("data-target") === currentSectionId) {
//                         btn.classList.add("active");
//                         if (floorDisplay) {
//                             floorDisplay.textContent = btn.getAttribute("data-floor");
//                         }
//                     }
//                 });
//             }
//         });
//     }
// });

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

    floorBtns.forEach(btn => {
        btn.addEventListener("click", function(e) {
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
                    setTimeout(() => { doors.classList.add("open"); }, 100);
                }, 1500);
            } else {
                setTimeout(() => { window.location.href = href; }, 1500);
            }
        });
    });

    if (isHomePage) {
        let lastScrollY = window.scrollY;
        const sections = Array.from(floorBtns).map(btn => document.getElementById(btn.getAttribute("data-target"))).filter(Boolean);

        window.addEventListener("scroll", () => {
            let currentScroll = window.scrollY;
            
            if (currentScroll > lastScrollY) dirArrow.textContent = "▼";
            else if (currentScroll < lastScrollY) dirArrow.textContent = "▲";
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
        });
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
        burger.addEventListener("click", () => {
            burger.classList.toggle("active");
            mobileMenu.classList.toggle("open");
            // Блокируем скролл фона, когда меню открыто
            document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
        });

        // Закрываем меню при клике на ссылку внутри него
        const mobileLinks = mobileMenu.querySelectorAll("a");
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                burger.classList.remove("active");
                mobileMenu.classList.remove("open");
                document.body.style.overflow = "";
            });
        });
    }
});