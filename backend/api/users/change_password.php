<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->current_password) && !empty($data->new_password)) {
    $user->id = $data->id;

    if($user->changePassword($data->current_password, $data->new_password)) {
        http_response_code(200);
        echo json_encode(array("success" => true, "message" => "Password changed successfully"));
    } else {
        http_response_code(401);
        echo json_encode(array("success" => false, "message" => "Current password is incorrect"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data"));
}
?>
