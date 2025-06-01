# 🍽️ Food Order App

Aplicación web para gestionar pedidos de comida. Desarrollada con Django (backend) y React (frontend). Compatible con ordenadores y tablets.

---

## Requisitos

- Python 3.13.0
- Node.js 22.16.0
- npm 10.9.2
- PostgreSQL (opcional) o SQLite
- Git

---

## 🛠️ Instalación

### 1. Clonar el repositorio

```
git clone https://github.com/tu-usuario/food-order.git
cd food-order
cd backend/
python -m venv env
source env/bin/activate  # en Windows: env\Scripts\activate
pip install -r requirements.txt
```
# Aplicar migraciones
```
python manage.py migrate
```
# Crear superusuario
```
python manage.py createsuperuser
```
# Ejecutar el servidor
```
python manage.py runserver
cd ../frontend/
npm install
npm run dev
```
