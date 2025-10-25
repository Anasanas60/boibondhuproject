# Use official PHP with Apache (simple for plain PHP)
FROM php:8.3-apache

# Enable Apache mod_rewrite (for any .htaccess if needed)
RUN a2enmod rewrite

# Copy your PHP files to Apache's web root
COPY . /var/www/html/

# Expose port 80
EXPOSE 80

# Start Apache (handles PHP automatically)
CMD ["apache2-foreground"]
