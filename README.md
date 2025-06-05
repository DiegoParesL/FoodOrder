# 🍽️ Food Order App (Linux Server)

Aplicación web para gestionar pedidos de comida. Desarrollada con Django (backend) y React (frontend). Compatible con ordenadores y Moviles.

---

## Requisitos

- Python 3.13.0
- Node.js 22.16.0
- npm 10.9.2
- SQLite
- Git

---

## 🛠️ Instalación

### 1. Clonar el repositorio

```
git clone https://github.com/DiegoParesL/FoodOrder.git
cd FoodOrder
python -m venv env
source env/bin/activate  # en Windows: env\Scripts\activate
pip install -r requirements.txt
```
# Aplicar migraciones
```
cd backend
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
# Ver frontend
```
(desde FoodOrder)
cd frontend
npm run build
```
El archivo generado es una carpeta que estara en el directorio con el nombre de "dist"
Para ver el frontend copiamos esa carpeta dist, estamos ubicados en el apartado frontend
# Comprobacion antes de pasar los archivos de dist a cualquier sitio
  Ten en cuenta que /foodorder-frontend/ (carpeta del siguiente comando para ver el frontend) es un nuevo directorio y hay que activarlo en /etc/apache/sites-available/
  Para el sites-available hace falta un archivo foodorder-frontend.conf, con algo similar a la siguiente estructura
```
  <VirtualHost *:80>
      ServerName TuUrl.tuDominio
  
      DocumentRoot /var/www/foodorder-frontend
  
      <Directory /var/www/foodorder-frontend>
          Options -Indexes +FollowSymLinks
          AllowOverride All
          Require all granted
      </Directory>
  
      ProxyPreserveHost On
      ProxyPass /api/ http://127.0.0.1:8000/api/
      ProxyPassReverse /api/ http://127.0.0.1:8000/api/
  
      ErrorLog ${APACHE_LOG_DIR}/frontend_error.log
      CustomLog ${APACHE_LOG_DIR}/frontend_access.log combined
  </VirtualHost>
```
# Ahora hace falta activar el .conf
```
sudo a2ensite foodorder-frontend.conf
```
# Reiniciamos el servidor
```
sudo service apache2 restart
```
# Siguiente paso
Ahora vamos a hacer el comando de: sudo nano /etc/hosts
Y dentro vamos a tener una estructura similar a:
```
127.0.0.1       localhost
# --- BEGIN PVE ---
192.168.XXX.XX tuSitioWeb.TuDominio
# --- END PVE ---
```
# AHORA SI 
Vamos al FoodOrder/frontend y hacemos el siguiente comando para pasar los archivos de /dist/ a /var/www/foodorder-frontend/
```
sudo cp -r ./dist/* /var/www/foodorder-frontend/
```
# Activar el gunicorn
  Seguidamente vamos a activar el gunicorn (para el django que funcione) en primer plano para ver que todo esté en orden, y luego ingresamos la pagina web en el buscador
 ```
gunicorn backend.wsgi:application --bind 127.0.0.1:8000
```
  Si esto te funciona perfectamente lo dejamos en segundo plano añadiendo un " &" al final del comando
```
gunicorn backend.wsgi:application --bind 127.0.0.1:8000 &
```
# E voilà
Tendras un servidor con la App de FoodOrder!!
