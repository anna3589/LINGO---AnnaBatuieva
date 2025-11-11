LINGO — Juego de palabras
Requisitos previos

Tener Docker instalado

Tener Docker Compose (incluido en Docker Desktop)

Asegúrate de que los puertos 80, 8080 y 5173 estén libres

Guía completa para ejecutar el proyecto
1. Clonar el proyecto y entrar en la carpeta
git clone https://github.com/anna3589/LINGO---AnnaBatuieva.git
cd LINGO---AnnaBatuieva

2. Configurar el archivo .env

Si el archivo .env no existe, crea una copia del ejemplo:

cp .env.example .env


Verifica que las siguientes líneas estén configuradas:

DB_HOST=db
DB_USERNAME=root
DB_PASSWORD=root_password_segura
VITE_DEV_SERVER_URL=http://localhost:5173


Generar la clave de la aplicación:

docker-compose exec web php artisan key:generate

3. Iniciar todos los servicios
docker-compose up -d


Contenedores que deben estar en estado Running:

laravel-apach — aplicación principal (PHP 8.3 + Apache)

laravel-mysql — base de datos MySQL 8.0

laravel-phpmyadmin — interfaz web para la base de datos

laravel-vite — servidor de desarrollo del frontend (Vite)

4. Instalar dependencias de PHP y ejecutar migraciones
docker-compose exec web composer install
docker-compose exec web php artisan migrate

5. Instalar dependencias de Node.js (si es necesario)

Las dependencias de Node.js se instalan automáticamente al iniciar por primera vez.
Si el frontend no funciona correctamente, ejecutar manualmente:

docker-compose exec node npm install

6. Acceso a las aplicaciones

Aplicación principal: http://localhost

phpMyAdmin: http://localhost:8080

Usuario: root

Contraseña: root_password_segura

Servidor Vite (frontend): http://localhost:5173

7. Cómo jugar

Abre http://localhost

Haz clic en Jugar

Adivina una palabra de 5 letras en español

Tienes 5 intentos y 60 segundos por partida

Colores de las pistas:

Verde — la letra está en la posición correcta

Amarillo — la letra existe en la palabra, pero en otra posición

Gris — la letra no está en la palabra

8. Comandos útiles

Detener la aplicación:

docker-compose down


Ver los registros:

docker-compose logs web    # Registros de PHP
docker-compose logs node   # Registros de Node.js


Reconstruir los contenedores:

docker-compose up -d --build


Volver a ejecutar las migraciones:

docker-compose exec web php artisan migrate:fresh


Acceso manual a la base de datos:

docker-compose exec db mysql -u root -p
# Contraseña: root_password_segura
