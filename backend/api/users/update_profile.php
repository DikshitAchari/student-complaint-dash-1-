<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->full_name)) {
    $user->id = $data->id;
    $user->full_name = $data->full_name;
    $user->contact = $data->contact ?? '';
    $user->department = $data->department ?? '';
    $user->year = $data->year ?? '';

    if($user->update()) {
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "Profile updated successfully"));
    } else {
        http_response_code(503);
        echo json_encode(array("success" => false, "message" => "Unable to update profile"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data"));
}
?>
