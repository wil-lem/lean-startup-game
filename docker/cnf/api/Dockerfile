# Set the base image for subsequent instructions
FROM php:8.2-apache

# install packages
RUN apt-get update -y
RUN apt-get install -y git


# PHP Extentions
RUN docker-php-ext-install exif
RUN docker-php-ext-install mysqli pdo pdo_mysql
RUN docker-php-ext-install bcmath


COPY --from=composer:2.2 /usr/bin/composer /usr/local/bin/composer



#COPY ./apache.conf /etc/apache2/sites-enabled/000-default.conf




# # Install needed extensions
# # Here you can install any other extension that you need during the test and deployment process
# RUN apt-get update -y && \
#     apt-get install -y \
#         git \
#         curl \
#         libmcrypt-dev \
#         libjpeg-dev \
#         libpng-dev \
#         libfreetype6-dev \
#         libbz2-dev \
#         libonig-dev \
#         libzip-dev \
#         unzip \
#         libxml2-dev \
#         mariadb-client \
#         wget \
#         nano

# # Clear out the local repository of retrieved package files
# RUN apt-get clean

# # #Install php extensions
# # RUN docker-php-ext-install \
# #     xml \
# #     dom \
# #     pcntl \
# #     zip \
# #     intl
# # RUN docker-php-ext-install \
# #     mbstring \
# #     pdo \
# #     pdo_mysql \
# #     json


# RUN apt-get update -y

# #Install redis
# RUN pecl install redis && docker-php-ext-enable redis


# Install php GD
RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

# Install Node JS
# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    rm -rf /var/lib/apt/lists/*



# RUN a2enmod headers

# RUN apt-get install -y nano dnsutils iputils-ping redis-tools


# RUN apt-get -yqq update
# RUN apt-get -yqq install exiftool
# RUN docker-php-ext-configure exif
# RUN docker-php-ext-install exif
# RUN docker-php-ext-enable exif



# RUN apt-get update
# RUN apt-get -y install gnupg


# Apache modules
RUN a2enmod rewrite

EXPOSE 5173 

WORKDIR /app
