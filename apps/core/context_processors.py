def site_settings(request):
    """
    Контакты компании — правятся прямо здесь, без отдельной модели/админки.
    Это простые статичные данные, которые меняются раз в год, отдельная
    таблица в базе ради них — лишняя сложность.
    """
    return {
        "site": {
            "phone": "+996700000000",
            "phone_display": "+996 700 000 000",
            "whatsapp": "https://wa.me/996700000000",
            "telegram": "https://t.me/unilift",
            "email": "info@unilift.kg",
            "address": "г. Бишкек, ул. Примерная, 1",
            "work_hours": "Пн–Сб 09:00–18:00",
            "map_url": "",
        }
    }


def hreflang_urls(request):
    """Строит корректные alternate-ссылки для ru/ky без задвоения префикса."""
    path = request.path
    if path.startswith("/ky/"):
        ru_path = path[3:] or "/"
    else:
        ru_path = path
    ky_path = "/ky" + ru_path if ru_path != "/" else "/ky/"

    base = f"{request.scheme}://{request.get_host()}"
    return {
        "hreflang_ru": base + ru_path,
        "hreflang_ky": base + ky_path,
    }