from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Meal, Order, OrderItem
from .serializers import MealSerializer
from django.shortcuts import get_object_or_404

class MealListView(APIView):
    def get(self, request):
        meals = Meal.objects.all()
        serializer = MealSerializer(meals, many=True)
        return Response(serializer.data)

class OrderCreateView(APIView):
    def post(self, request):
        items_data = request.data.get('items', [])

        if not items_data:
            return Response({'error': 'No se enviaron comidas.'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create()

        for item in items_data:
            meal_id = item.get('meal')
            quantity = item.get('quantity', 1)

            if meal_id is None:
                continue  # o puedes devolver un error si prefieres

            meal = get_object_or_404(Meal, id=meal_id)
            OrderItem.objects.create(order=order, meal=meal, quantity=quantity)

        return Response({'message': 'Pedido recibido correctamente.'}, status=status.HTTP_201_CREATED)
