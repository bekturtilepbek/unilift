from django import template
from django.conf import settings

register = template.Library()

@register.simple_tag(takes_context=True)
def lang_switch_url(context, lang_code):
    request = context["request"]
    path = request.path_info
    query = request.META.get("QUERY_STRING", "")

    # снимаем текущий языковой префикс, если он есть
    for code, _ in settings.LANGUAGES:
        prefix = f"/{code}/"
        if path.startswith(prefix):
            path = "/" + path[len(prefix):]
            break

    if lang_code != settings.LANGUAGE_CODE:  # ru — дефолтный, без префикса
        path = f"/{lang_code}{path}"

    return f"{path}?{query}" if query else path
