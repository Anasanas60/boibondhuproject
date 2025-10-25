# Use official PHP with Apache
FROM php:8.3-apache

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install PostgreSQL PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Copy API files to Apache web root
COPY api/ /var/www/html/

# Create a simple test endpoint
RUN echo "<?php echo 'API is working!'; ?>" > /var/www/html/test.php

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]