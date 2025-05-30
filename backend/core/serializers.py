from rest_framework import serializers
from .models import Meal, Order, OrderItem

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['meal', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'items']

    def create(self, validated_data):
        items = validated_data.pop('items')
        order = Order.objects.create()
        for item in items:
            OrderItem.objects.create(order=order, **item)
        return order
