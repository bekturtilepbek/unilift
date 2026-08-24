from django.views.generic import TemplateView
from django.http import HttpResponse
from django.urls import reverse

from apps.projects.models import Project


class HomeView(TemplateView):
    template_name = "pages/home.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["featured_projects"] = (
            Project.objects.filter(is_published=True, is_featured=True)
            .select_related("category")
            .order_by("order", "-created_at")[:6]
        )
        return ctx

def robots_txt(request):
    lines = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /admin/",
        f"Sitemap: {request.scheme}://{request.get_host()}{reverse('sitemap')}",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")