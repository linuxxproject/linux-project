FROM php:8.3-fpm

ARG user=laravel
ARG uid=1000

RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN useradd -u $uid -ms /bin/bash -g www-data $user

WORKDIR /var/www

COPY . /var/www

RUN chown -R $user:www-data /var/www

USER $user

EXPOSE 9000

CMD ["php-fpm"]
