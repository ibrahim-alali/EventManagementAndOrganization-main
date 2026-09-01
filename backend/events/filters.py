import django_filters
from .models import Event


class EventFilter(django_filters.FilterSet):
    min_date = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    max_date = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    

    class Meta:
        model = Event
        # expose status and venue as filterable fields + custom date and public filters
        fields = []

                    
class EventFilterForOrganizer(django_filters.FilterSet):
    min_date = django_filters.DateFilter(field_name='date', lookup_expr='gte')
    max_date = django_filters.DateFilter(field_name='date', lookup_expr='lte')
    is_public = django_filters.BooleanFilter(field_name='is_public')
    class Meta:
        model = Event
        # expose status and venue as filterable fields + custom date and public filters
        fields = []
