from .base import *  # noqa: F403

DEBUG = True

# Разрешаем локальный доступ и расширяем текущий список хостов
ALLOWED_HOSTS = list(ALLOWED_HOSTS) + ["localhost", "127.0.0.1", "0.0.0.0"]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# В деве статику удобнее отдавать без хэшей в имени файла — быстрее итерация
STORAGES = {
    **STORAGES,  # noqa: F405
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}

INSTALLED_APPS += ["django.contrib.admindocs"]  # noqa: F405

try:
    import debug_toolbar  # noqa: F401

    INSTALLED_APPS += ["debug_toolbar"]  # noqa: F405
    MIDDLEWARE = ["debug_toolbar.middleware.DebugToolbarMiddleware"] + MIDDLEWARE  # noqa: F405
    INTERNAL_IPS = ["127.0.0.1"]
except ImportError:
    pass