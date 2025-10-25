<?php
// api/db_connect.php

// Database connection parameters
define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'boibondhu');
define('DB_USERNAME', 'postgres');
define('DB_PASSWORD', '');

// Create PDO connection for PostgreSQL
try {
    $dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
    $conn = new PDO($dsn, DB_USERNAME, DB_PASSWORD, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
