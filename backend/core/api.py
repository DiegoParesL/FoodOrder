from http import HTTPStatus
from ninja import NinjaAPI, Schema
from pydantic import BaseModel
from .schemas import ItemOut
from .models import Order, OrderItem, Meal
from .meals import meals_router
from .auth import auth_router
from .orders import pedidos_router
from typing import List
from ninja.security import django_auth


api = NinjaAPI(csrf=True)
class OrderItemOut(Schema):
    meal_name: str
    quantity: int
    price: float

class PedidoOut(Schema):
    id: int
    created_at: str
    total: float
    items: List[OrderItemOut]

@api.get("/mis-pedidos/", response=List[PedidoOut])
def mis_pedidos(request):
    if not request.user.is_authenticated:
        return [], 401

    pedidos = Order.objects.filter(user=request.user).prefetch_related("items__meal")
    resultado = []
    for pedido in pedidos:
        items_out = []
        total = 0
        for item in pedido.items.all():
            subtotal = item.meal.price * item.quantity
            total += subtotal
            items_out.append(OrderItemOut(
                meal_name=item.meal.name,
                quantity=item.quantity,
                price=item.meal.price
            ))
        resultado.append(PedidoOut(
            id=pedido.id,
            created_at=pedido.created_at.isoformat(),
            total=total,
            items=items_out
        ))
    return resultado


api.add_router("/meals/", meals_router)

api.add_router("/auth/", auth_router)

api.add_router("/orders/", pedidos_router)