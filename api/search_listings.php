<?php
require_once 'cors.php';
header('Content-Type: application/json');
require_once 'db_connect.php';

$searchTermRaw = $_GET['q'] ?? '';
$page = max(1, intval($_GET['page'] ?? 1));
$limit = 12;
$offset = ($page - 1) * $limit;

try {
    if ($searchTermRaw === '') {
        // If no search term, return all listings
        $query = "SELECT l.*, u.name as seller_name
                  FROM listings l
                  JOIN users u ON l.seller_id = u.user_id
                  ORDER BY l.created_at DESC
                  LIMIT :limit OFFSET :offset";
        $stmt = $conn->prepare($query);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
    } else {
        // Better search with partial matches and relevance scoring
        $searchTerm = "%{$searchTermRaw}%";
        $query = "SELECT l.*, u.name as seller_name,
                         CASE
                            WHEN l.title ILIKE :st THEN 3
                            WHEN l.author ILIKE :st THEN 2
                            WHEN l.course_code ILIKE :st THEN 1
                            ELSE 0
                         END as relevance
                  FROM listings l
                  JOIN users u ON l.seller_id = u.user_id
                  WHERE l.title ILIKE :st OR l.author ILIKE :st OR l.course_code ILIKE :st
                  ORDER BY relevance DESC, l.created_at DESC
                  LIMIT :limit OFFSET :offset";
        $stmt = $conn->prepare($query);
        $stmt->bindValue(':st', $searchTerm, PDO::PARAM_STR);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
    }

    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get total count for pagination
    if ($searchTermRaw === '') {
        $countQuery = "SELECT COUNT(*) as total FROM listings";
        $countStmt = $conn->query($countQuery);
        $total = (int)$countStmt->fetchColumn();
    } else {
        $countQuery = "SELECT COUNT(*) as total FROM listings
                      WHERE title ILIKE :st OR author ILIKE :st OR course_code ILIKE :st";
        $countStmt = $conn->prepare($countQuery);
        $countStmt->execute([':st' => "%{$searchTermRaw}%"]);
        $total = (int)$countStmt->fetchColumn();
    }

    echo json_encode([
        'success' => true,
        'listings' => $listings,
        'total' => $total,
        'page' => $page,
        'totalPages' => ceil($total / $limit)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    error_log('[search_listings] error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Search failed'
    ]);
}

?>