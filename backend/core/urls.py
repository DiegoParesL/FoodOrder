from django.urls import path
from .views import MealListView, OrderCreateView

urlpatterns = [
    path('api/meals/', MealListView.as_view(), name='meals'),
    path('api/orders/', OrderCreateView.as_view(), name='orders'),
]
