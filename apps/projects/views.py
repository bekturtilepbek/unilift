from django.views.generic import DetailView, ListView

from .models import Project, ProjectCategory


class ProjectListView(ListView):
    model = Project
    template_name = "projects/list.html"
    context_object_name = "projects"
    paginate_by = 9

    def get_queryset(self):
        qs = Project.objects.filter(is_published=True).prefetch_related("categories")
        category_slug = self.request.GET.get("category")
        if category_slug:
            qs = qs.filter(categories__slug=category_slug)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["categories"] = ProjectCategory.objects.all()
        ctx["active_category"] = self.request.GET.get("category", "")
        return ctx


class ProjectDetailView(DetailView):
    model = Project
    template_name = "projects/detail.html"
    context_object_name = "project"

    def get_queryset(self):
        return Project.objects.filter(is_published=True).prefetch_related("images", "categories")