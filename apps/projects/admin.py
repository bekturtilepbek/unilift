from django.contrib import admin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from modeltranslation.admin import TabbedTranslationAdmin
from unfold.admin import ModelAdmin, TabularInline

from .models import Project, ProjectCategory, ProjectImage


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(TabbedTranslationAdmin, ModelAdmin):
    list_display = ("name", "slug", "order")
    list_editable = ("order",)
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


class ProjectImageInline(TabularInline):
    model = ProjectImage
    extra = 1
    fields = ("preview", "image", "caption", "order")
    readonly_fields = ("preview",)
    verbose_name = _("Фото")
    verbose_name_plural = _("Фотографии проекта")

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="height:60px;border-radius:4px;">', obj.image.url)
        return "—"
    preview.short_description = _("Превью")


@admin.register(Project)
class ProjectAdmin(TabbedTranslationAdmin, ModelAdmin):
    list_display = ("cover_preview", "title", "city", "year", "is_published", "is_featured", "order")
    list_editable = ("is_published", "is_featured", "order")
    list_filter = ("is_published", "is_featured", "categories", "city")
    search_fields = ("title", "summary", "city", "client_name")
    filter_horizontal = ("categories",)
    inlines = [ProjectImageInline]

    fieldsets = (
        (_("Основное"), {
            "fields": ("title", "categories", "summary", "cover"),
        }),
        (_("Подробности"), {
            "fields": ("description", "city", "year", "client_name", "equipment"),
        }),
        (_("Публикация"), {
            "fields": ("is_published", "is_featured", "order"),
        }),
        (_("Технические настройки"), {
            "fields": ("slug",),
            "classes": ("collapse",),
            "description": _(
                "Slug используется в адресе страницы проекта. Заполняется автоматически "
                "по названию — трогать вручную не нужно, если не уверены."
            ),
        }),
    )

    def cover_preview(self, obj):
        if obj.cover:
            return format_html('<img src="{}" style="height:44px;border-radius:4px;">', obj.cover.url)
        return "—"
    cover_preview.short_description = _("Фото")