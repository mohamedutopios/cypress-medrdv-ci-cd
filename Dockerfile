# ============================================
#  STAGE 1 : Composer dependencies
# ============================================
FROM composer:2 AS composer-stage

WORKDIR /app
COPY composer.json composer.lock* ./
RUN composer install \
    --no-dev \
    --no-scripts \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# ============================================
#  STAGE 2 : Production image (PHP-FPM + Nginx)
# ============================================
FROM php:8.2-fpm-alpine AS production

# Dépendances système
RUN apk add --no-cache \
    nginx \
    supervisor \
    icu-dev \
    libzip-dev \
    && docker-php-ext-install \
    pdo_mysql \
    intl \
    opcache \
    zip \
    && rm -rf /var/cache/apk/*

# Configuration PHP pour production
RUN { \
    echo 'opcache.enable=1'; \
    echo 'opcache.memory_consumption=256'; \
    echo 'opcache.max_accelerated_files=20000'; \
    echo 'opcache.validate_timestamps=0'; \
    echo 'realpath_cache_size=4096K'; \
    echo 'realpath_cache_ttl=600'; \
    } > /usr/local/etc/php/conf.d/symfony.ini

# Configuration Nginx
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Configuration Supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copier l'application
WORKDIR /var/www
COPY --from=composer-stage /app/vendor ./vendor
COPY . .

# Fix permissions
RUN chown -R www-data:www-data /var/www/var /var/www/public \
    && mkdir -p /var/www/var/cache /var/www/var/log \
    && chmod -R 775 /var/www/var

# Warmup cache Symfony
RUN APP_ENV=prod php bin/console cache:clear --no-warmup \
    && APP_ENV=prod php bin/console cache:warmup

# Nginx pid + logs
RUN mkdir -p /run/nginx

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
