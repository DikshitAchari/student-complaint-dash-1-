<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/User.php';

// Set timezone to UTC to prevent expiry issues
date_default_timezone_set('UTC');

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->token)) {
    $user->email = $data->email;
    $token = $data->token;
    
    // Check if user exists
    if ($user->getUserByEmail()) {
        // Verify token
        if ($user->verifyToken($token)) {
            // Mark user as verified
            if ($user->markAsVerified()) {
                http_response_code(200);
                echo json_encode(array("success" => true, "message" => "Email verified successfully"));
            } else {
                http_response_code(500);
                echo json_encode(array("success" => false, "message" => "Failed to update verification status"));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("success" => false, "message" => "Invalid or expired verification code"));
        }
    } else {
        http_response_code(404);
        echo json_encode(array("success" => false, "message" => "User not found"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Email and verification code are required"));
}
?>