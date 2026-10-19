def site_settings(request):
    """
    Контакты компании — правятся прямо здесь, без отдельной модели/админки.
    Это простые статичные данные, которые меняются раз в год, отдельная
    таблица в базе ради них — лишняя сложность.
    """
    return {
        "site": {
            "phone": "+996500000114",
            "phone_display": "+996 500 000 114",
            "whatsapp": "https://wa.me/996500000114",
            "telegram": "https://t.me/unilift",
            "email": "uniliftkg@gmail.com",
            "address": "г. Бишкек, ул. Ташкумырская, 2/2а",
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