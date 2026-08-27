(function () {
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (!burger || !mobileMenu) return;

  burger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
    burger.classList.toggle('open');
  });

  // Закрываем меню при клике на ссылку — иначе остаётся висеть поверх контента
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
    });
  });

  // Закрываем меню при смене масштаба/повороте экрана — иначе виснет поверх
  // уже не мобильной раскладки
  window.addEventListener('resize', function () {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
  });
})();


(function () {
  var header = document.getElementById('top');
  if (!header) return;

  var lastY = window.scrollY;
  var hideThreshold = 120; // не прячем, пока не проскроллили хотя бы на 120px от верха

  window.addEventListener('scroll', function () {
    var currentY = window.scrollY;

    if (currentY < hideThreshold) {
      header.classList.remove('header-hidden');
    } else if (currentY > lastY) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }

    lastY = currentY;
  }, { passive: true });
})();