# Use official PHP with Apache
FROM php:8.3-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install PHP MySQL extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copy ONLY the API folder to Apache's web root
COPY api/ /var/www/html/

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
