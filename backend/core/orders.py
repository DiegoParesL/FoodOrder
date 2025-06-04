from ninja import Router, Schema
from .models import Order, Meal, OrderItem
from .schemas import PedidoSchema
from typing import List
from ninja.errors import HttpError
from ninja.security import django_auth
from django.shortcuts import get_object_or_404

pedidos_router = Router()
class OrderItemInput(Schema):
    meal_id: int
    quantity: int

class PedidoSchema(Schema):
    items: List[OrderItemInput]

@pedidos_router.post("/order/")
def crear_pedido(request, data: PedidoSchema):
    order = Order.objects.create(user=request.user)
    for item in data.items:
        meal = get_object_or_404(Meal, id=item.meal_id)
        OrderItem.objects.create(
            order=order,
            meal=meal,
            quantity=item.quantity
        )
    return {"success": True, "message": "Pedido creado"}