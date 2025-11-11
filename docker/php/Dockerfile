# Usa una imagen base de PHP con Apache
FROM php:8.3-apache

# 1. Combinar todas las instalaciones de sistema en una sola capa
RUN apt-get update && apt-get install -y \
    # Dependencias de sistema (para Node, Git, Composer)
    curl \
    gnupg \
    git \
    unzip \
    libzip-dev \
    # Dependencias para extensiones de PHP (imágenes)
    libpng-dev \
    libjpeg-dev \
    \
    # ---- INICIO: Instalación de Node.js (de tu PDF) ----
    # Añade el repositorio de Node.js
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    # Instala Node.js (¡fíjate que unimos la línea 11 aquí!)
    && apt-get install -y nodejs \
    # ---- FIN: Instalación de Node.js ----
    \
    # Limpia la caché para reducir el tamaño de la imagen
    && apt-get -y clean \
    && rm -rf /var/lib/apt/lists/* \
    \
    # Habilita las extensiones de PHP necesarias para Laravel
    && docker-php-ext-install pdo pdo_mysql zip exif pcntl gd

# 2. (Opcional pero recomendado) Actualiza NPM a su última versión
RUN npm install -g npm@latest

# 3. Instalar Composer globalmente
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Configuración de Apache: Modificar el Virtual Host
COPY ./apache.conf /etc/apache2/sites-available/000-default.conf

# 5. Habilitar el módulo 'rewrite' (URLs limpias de Laravel)
RUN a2enmod rewrite

# 6. Establecer el directorio de trabajo
WORKDIR /var/www/html

# El puerto 80 ya está expuesto por defecto