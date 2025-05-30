from django.contrib import admin
from .models import Meal, Order, OrderItem

class OrderItemInline(admin.TabularInline):  # También puedes usar StackedInline
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ['id', 'created_at']
    readonly_fields = ['created_at']

admin.site.register(Meal)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)