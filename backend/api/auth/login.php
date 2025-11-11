<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/User.php';

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->usn) && !empty($data->password)) {
    $user->usn = $data->usn;
    $user->password = $data->password;

    if($user->login()) {
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "message" => "Login successful",
            "user" => array(
                "id" => $user->id,
                "fullName" => $user->full_name,
                "usn" => $user->usn,
                "email" => $user->email,
                "role" => $user->role,
                "department" => $user->department,
                "year" => $user->year,
                "contact" => $user->contact
            )
        ));
    } else {
        http_response_code(401);
        echo json_encode(array("success" => false, "message" => "Invalid USN or password"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data"));
}
?>
