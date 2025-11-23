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
    $loginType = isset($data->loginType) ? $data->loginType : 'student';

    if ($user->login()) {
        // Validate login type matches user role
        if($loginType === 'admin' && $user->role !== 'admin') {
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Invalid admin credentials"));
            exit();
        }
        
        if($loginType === 'student' && $user->role === 'admin') {
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Admin accounts cannot login through student portal"));
            exit();
        }
        
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
        // Login failed. Determine the reason.
        $tempUser = new User($db);
        $tempUser->usn = $data->usn;

        // Check if the user exists and if their email is unverified.
        if ($tempUser->getByUsn() && $tempUser->role === 'student' && !$tempUser->email_verified) {
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Email not verified. Please check your email for the verification code."));
        } else {
            // Otherwise, it's just invalid credentials.
            http_response_code(401);
            echo json_encode(array("success" => false, "message" => "Invalid USN or password"));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data"));
}
?>