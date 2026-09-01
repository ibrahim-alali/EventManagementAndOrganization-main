import django_filters
from .models import Venue

class VenueFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price_per_hour", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price_per_hour", lookup_expr="lte")
    min_capacity = django_filters.NumberFilter(field_name="capacity", lookup_expr="gte")
    max_capacity = django_filters.NumberFilter(field_name="capacity", lookup_expr="lte")

    class Meta:
        model = Venue
        fields = ["status"]  # باقي الحقول محددة فوق
