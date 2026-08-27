"""
Общие настройки для dev и prod.
Специфика окружения — в dev.py / prod.py.
"""
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "dev-only-insecure-key-do-not-use-in-production-" + "x" * 20,
)

DEBUG = os.environ.get("DJANGO_DEBUG", "False") == "True"

ALLOWED_HOSTS = [
    h.strip() for h in os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",") if h.strip()
]

CSRF_TRUSTED_ORIGINS = [
    o.strip() for o in os.environ.get("DJANGO_CSRF_TRUSTED_ORIGINS", "").split(",") if o.strip()
]

# ---------------------------------------------------------------------------
# Приложения
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    # Unfold должен идти перед django.contrib.admin
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",

    "modeltranslation",

    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sitemaps",
    "django.contrib.humanize",

    "imagekit",

    "apps.core",
    "apps.projects",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",  # определяет язык до урлов
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "django.template.context_processors.i18n",
                "apps.core.context_processors.site_settings",
                "apps.core.context_processors.hreflang_urls",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ---------------------------------------------------------------------------
# База данных — SQLite по умолчанию, файл в /app/db (volume в Docker).
# Переключение на Postgres — через DATABASE_URL, без изменения кода.
# ---------------------------------------------------------------------------
DATABASE_URL = os.environ.get("DATABASE_URL")

if DATABASE_URL:
    import dj_database_url

    DATABASES = {"default": dj_database_url.parse(DATABASE_URL, conn_max_age=600)}
else:
    DB_DIR = BASE_DIR / "db"
    DB_DIR.mkdir(exist_ok=True)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": DB_DIR / "db.sqlite3",
        }
    }

# AUTH_PASSWORD_VALIDATORS = [
#     {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
#     {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
#     {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
#     {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
# ]

# ---------------------------------------------------------------------------
# Локализация: русский — основной язык (без префикса в URL), кыргызский — /ky/
# ---------------------------------------------------------------------------
LANGUAGE_CODE = "ru"
LANGUAGES = [
    ("ru", "Русский"),
    ("ky", "Кыргызча"),
]
LOCALE_PATHS = [BASE_DIR / "locale"]

MODELTRANSLATION_DEFAULT_LANGUAGE = "ru"
MODELTRANSLATION_LANGUAGES = ("ru", "ky")
MODELTRANSLATION_FALLBACK_LANGUAGES = ("ru",)

TIME_ZONE = "Asia/Bishkek"
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# Статика и медиа
# ---------------------------------------------------------------------------
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ---------------------------------------------------------------------------
# Unfold (админка)
# ---------------------------------------------------------------------------
UNFOLD = {
    "SITE_TITLE": "Unilift — управление сайтом",
    "SITE_HEADER": "Unilift",
    "SHOW_LANGUAGES": True,
    "COLORS": {
        "primary": {
            "50": "250 250 250",
            "100": "244 244 245",
            "200": "228 228 231",
            "300": "212 212 216",
            "400": "161 161 170",
            "500": "113 113 122",
            "600": "82 82 91",
            "700": "63 63 70",
            "800": "39 39 42",
            "900": "24 24 27",
            "950": "9 9 11",
        },
    },
}


DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "noreply@unilift.kg")