# Use official PHP with Apache
FROM php:8.3-apache

# Enable Apache mod_rewrite and debug
RUN a2enmod rewrite
RUN echo "LogLevel debug" >> /etc/apache2/apache2.conf
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Install PostgreSQL PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# DEBUG: Show what's in container before copy
RUN echo "=== INITIAL FILES ===" && ls -la /var/www/html/

# Copy API files
COPY api/ /var/www/html/

# DEBUG: Show what was copied
RUN echo "=== AFTER COPY ===" && ls -la /var/www/html/
RUN echo "=== PHP FILES ===" && find /var/www/html/ -name "*.php" | head -20
RUN echo "=== HTACCESS ===" && cat /var/www/html/.htaccess || echo "No .htaccess"

# Create multiple test endpoints
RUN echo "<?php echo 'DIRECT TEST WORKS'; ?>" > /var/www/html/direct_test.php
RUN echo "<?php echo 'INDEX REDIRECT TEST'; ?>" > /var/www/html/index_simple.php

# Fix permissions
RUN chmod -R 755 /var/www/html/

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]