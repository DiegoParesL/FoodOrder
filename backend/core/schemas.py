from typing import List
from ninja import Schema
from pydantic import BaseModel

class MealSchema(Schema):
    id: int
    name: str
    price: float

class RegisterSchema(Schema):
    username: str
    password: str

class ItemOut(Schema):
    name: str
    quantity: int

class MealOut(Schema):
    id: int
    name: str

class OrderOut(Schema):
    id: int
    meal: MealOut
    quantity: int
    created_at: str

class PedidoSchema(Schema):
    meal_id: int
    cantidad: int
