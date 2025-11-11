<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->full_name) &&
    !empty($data->usn) &&
    !empty($data->email) &&
    !empty($data->password) &&
    !empty($data->role)
) {
    $user->full_name = $data->full_name;
    $user->usn = $data->usn;
    $user->email = $data->email;
    $user->password = $data->password;
    $user->role = 'student'; // Force student role - admin registration not allowed
    $user->department = $data->department ?? '';
    $user->year = $data->year ?? '';
    $user->contact = $data->contact ?? '';

    // Check if USN already exists
    if($user->usnExists()) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "USN already registered"));
        exit();
    }

    // Check if email already exists
    if($user->emailExists()) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Email already registered"));
        exit();
    }

    // Create user
    if($user->create()) {
        http_response_code(201);
        echo json_encode(array("success" => true, "message" => "Registration successful"));
    } else {
        http_response_code(503);
        echo json_encode(array("success" => false, "message" => "Unable to register user"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data"));
}
?>
