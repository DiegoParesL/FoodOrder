from ninja import Router, Schema
from typing import List
from .models import Meal  # Asegúrate de importar tu modelo Meal
from .schemas import MealSchema  # Lo veremos en el siguiente paso

meals_router = Router()

@meals_router.get("/meal/", response=List[MealSchema])
def listar_meals(request):
    return Meal.objects.all()