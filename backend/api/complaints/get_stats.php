<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/Complaint.php';

$database = new Database();
$db = $database->getConnection();
$complaint = new Complaint($db);

// Get student_id from query parameter
$student_id = isset($_GET['student_id']) ? $_GET['student_id'] : die();

$stats = $complaint->getStatsByStudent($student_id);

http_response_code(200);
echo json_encode($stats);
?>
