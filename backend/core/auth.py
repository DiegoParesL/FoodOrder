from ninja import Router, Schema
from django.contrib.auth.models import User
from pydantic import BaseModel
from django.contrib.auth import authenticate as django_authenticate, login, logout
from django.middleware.csrf import get_token
from ninja.errors import HttpError
from http import HTTPStatus

auth_router = Router()

class RegisterSchema(Schema):
    username: str
    password: str

class RegisterResponse(Schema):
    success: bool
    message: str

class LoginSchema(BaseModel):
    username: str
    password: str



@auth_router.get("/csrf/")
def get_csrf_token(request):
    return {"csrfToken":  get_token(request) }

@auth_router.post("/register/")
def register(request, data: RegisterSchema):
    if User.objects.filter(username=data.username).exists():
        raise HttpError(HTTPStatus.CONFLICT, "El usuario ya existe")

    user = User.objects.create_user(username=data.username, password=data.password)
    login(request, user)  # Inicia sesión automáticamente tras registrar
    return {"success": True, "message": "Usuario registrado correctamente"}

class LoginSchema(Schema):
    username: str
    password: str

@auth_router.post("/login/")
def login_view(request, data: LoginSchema):
    user = django_authenticate(request, username=data.username, password=data.password)
    if user is None:
        raise HttpError(HTTPStatus.UNAUTHORIZED, "Credenciales inválidas")

    login(request, user)
    return {"success": True, "message": "Inicio de sesión correcto"}
    
@auth_router.post("/logout/")
def logout_view(request):
    logout(request)
    return {"success": True, "message": "Sesión cerrada correctamente"}

@auth_router.get("/yo/")
def yo(request):
    if request.user.is_authenticated:
        return {
            "logged_in": True,
            "username": request.user.username
        }
        
    else :
        return {
            "logged_in": False,
            "username": None
        }

