from django.contrib import admin
from .models import Meal, Order, OrderItem

class OrderItemInline(admin.TabularInline):  # También puedes usar StackedInline
    model = OrderItem
    extra = 0


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ["id", "order", "meal", "quantity"] 

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'created_at']
    readonly_fields = ['created_at']

admin.site.register(Meal)