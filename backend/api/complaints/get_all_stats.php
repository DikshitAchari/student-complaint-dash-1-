<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/Complaint.php';

$database = new Database();
$db = $database->getConnection();
$complaint = new Complaint($db);

// Get overall statistics for admin
$query = "SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) as open,
            SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress,
            SUM(CASE WHEN status IN ('Resolved', 'Closed') THEN 1 ELSE 0 END) as resolved
          FROM complaints";

$stmt = $db->prepare($query);
$stmt->execute();
$stats = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode($stats);
?>
