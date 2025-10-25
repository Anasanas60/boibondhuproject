<?php
// api/db_connect.php
// PostgreSQL PDO connector
// This file replaces the previous MySQLi connector. It creates a PDO instance
// connected to a PostgreSQL database and exposes it as $conn (for backward
// compatibility with code that calls $conn->prepare()).
//
// Environment variables supported (preferred):
// - DATABASE_URL (postgres://user:pass@host:port/dbname)
// OR
// - DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD
// - (optional) APP_ENV=development to show detailed errors in dev

// --- Read configuration from environment ---
$databaseUrl = getenv('DATABASE_URL');
if ($databaseUrl !== false && $databaseUrl !== '') {
    $parts = parse_url($databaseUrl);
    $dbHost = $parts['host'] ?? null;
    $dbPort = $parts['port'] ?? '5432';
    $dbUser = $parts['user'] ?? null;
    $dbPass = $parts['pass'] ?? null;
    $dbName = isset($parts['path']) ? ltrim($parts['path'], '/') : null;
} else {
    // Require explicit environment variables for production
    $dbHost = getenv('DB_HOST') ?: getenv('PGHOST');
    $dbPort = getenv('DB_PORT') ?: getenv('PGPORT') ?: '5432';
    $dbName = getenv('DB_NAME') ?: getenv('PGDATABASE');
    $dbUser = getenv('DB_USER') ?: getenv('PGUSER');
    $dbPass = getenv('DB_PASSWORD') !== false ? getenv('DB_PASSWORD') : (getenv('PGPASSWORD') !== false ? getenv('PGPASSWORD') : false);

    $missing = [];
    if (!$dbHost) $missing[] = 'DB_HOST';
    if (!$dbName) $missing[] = 'DB_NAME';
    if (!$dbUser) $missing[] = 'DB_USER';
    if ($dbPass === false) $missing[] = 'DB_PASSWORD';

    if (!empty($missing)) {
        // Log details for operators but return a safe generic error to clients
        error_log('[db_connect] Missing required DB environment variables: ' . implode(', ', $missing));
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Database configuration error']);
        exit;
    }
}

$dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $dbHost, $dbPort, $dbName);

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $dbUser, $dbPass, $options);
    // Expose $conn for compatibility with existing code (uses $conn->prepare())
    $conn = $pdo;
} catch (PDOException $e) {
    // Production-safe error handling: log details but return a generic message to clients.
    $errMsg = $e->getMessage();
    error_log("[db_connect] Database connection error: " . $errMsg);

    $appEnv = strtolower(getenv('APP_ENV') ?: getenv('ENV') ?: 'production');
    http_response_code(500);

    if ($appEnv === 'development' || getenv('DEBUG') === '1') {
        // In development, output a helpful JSON error (do not do this in production).
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Database connection failed', 'detail' => $errMsg]);
    } else {
        // Generic response for production
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Internal Server Error']);
    }

    // Stop further execution to avoid cascading failures.
    exit;
}

?>
