from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.utils.text import slugify
from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill, ResizeToFit


class ProjectCategory(models.Model):
    name = models.CharField(_("Название"), max_length=100)
    slug = models.SlugField(_("Slug"), max_length=110, unique=True)
    order = models.PositiveIntegerField(_("Порядок"), default=0)

    class Meta:
        verbose_name = _("Категория проекта")
        verbose_name_plural = _("Категории проектов")
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name, allow_unicode=False)
        super().save(*args, **kwargs)


class Project(models.Model):
    title = models.CharField(_("Название проекта"), max_length=200)
    slug = models.SlugField(_("Slug"), max_length=220, unique=True, help_text=_("Используется в адресе страницы, например: tsum-bishkek"))
    category = models.ForeignKey(
        ProjectCategory,
        verbose_name=_("Категория"),
        related_name="projects",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    summary = models.CharField(_("Краткое описание"), max_length=200, help_text=_("Показывается в карточке на лендинге и в каталоге, до 200 символов"))
    description = models.TextField(_("Полное описание"), blank=True, help_text=_("Показывается на детальной странице проекта"))

    city = models.CharField(_("Город"), max_length=100, blank=True)
    year = models.PositiveIntegerField(_("Год реализации"), blank=True, null=True)
    client_name = models.CharField(_("Заказчик"), max_length=200, blank=True)
    equipment = models.CharField(_("Оборудование"), max_length=300, blank=True, help_text=_("Например: 6 лифтов Schindler 3300, 12 остановок"))

    cover = ProcessedImageField(
        verbose_name=_("Обложка"),
        upload_to="projects/covers/",
        processors=[ResizeToFill(1200, 800)],
        format="WEBP",
        options={"quality": 85},
        blank=True,
        null=True,
    )

    is_published = models.BooleanField(_("Опубликовано"), default=False, help_text=_("Пока не отмечено — проект не виден на сайте"))
    is_featured = models.BooleanField(_("Показывать на главной"), default=False)
    order = models.PositiveIntegerField(_("Порядок"), default=0)
    created_at = models.DateTimeField(_("Создано"), auto_now_add=True)

    class Meta:
        verbose_name = _("Проект")
        verbose_name_plural = _("Проекты")
        ordering = ["order", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title, allow_unicode=False)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("projects:detail", kwargs={"slug": self.slug})


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, verbose_name=_("Проект"), related_name="images", on_delete=models.CASCADE)
    image = ProcessedImageField(
        verbose_name=_("Фото"),
        upload_to="projects/gallery/",
        processors=[ResizeToFit(1600, 1600)],
        format="WEBP",
        options={"quality": 85},
    )
    caption = models.CharField(_("Подпись"), max_length=200, blank=True)
    order = models.PositiveIntegerField(_("Порядок"), default=0)

    class Meta:
        verbose_name = _("Фото проекта")
        verbose_name_plural = _("Фото проекта")
        ordering = ["order"]

    def __str__(self):
        return f"{self.project.title} — {self.caption or self.image.name}"