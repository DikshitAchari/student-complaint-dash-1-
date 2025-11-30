<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../models/User.php';
include_once '../../utils/email_verification.php';

// Ensure the required function is available
if (!function_exists('generateVerificationCode')) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Server configuration error: missing required functions"]);
    exit();
}

// Set timezone to UTC to prevent expiry issues
date_default_timezone_set('UTC');

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if (empty($data->action)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Action not specified."]);
    exit();
}

$action = $data->action;

if ($action === 'send_reset_otp') {
    if (empty($data->email)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Email is required."]);
        exit();
    }

    $user->email = $data->email;
    $query = "SELECT id, usn FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $user->email);
    $stmt->execute();
    $user_row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user_row) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No user found with that email address."]);
        exit();
    }

    $user_id = $user_row['id'];
    $usn = $user_row['usn'];
    $token = generateVerificationCode();
    $expires_at = date('Y-m-d H:i:s', strtotime('+5 minutes'));

    $token_query = "INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)";
    $token_stmt = $db->prepare($token_query);
    $token_stmt->bindParam(":user_id", $user_id);
    $token_stmt->bindParam(":token", $token);
    $token_stmt->bindParam(":expires_at", $expires_at);

    if ($token_stmt->execute()) {
        sendVerificationEmail($user->email, $usn, $token);
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Password reset OTP has been sent to your email."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to generate reset token."]);
    }

} elseif ($action === 'verify_otp' || $action === 'reset_password') {
    // Handle both verify_otp and reset_password actions (to support both frontend implementations)
    if (empty($data->email) || empty($data->otp)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Email and OTP are required."]);
        exit();
    }

    $email = $data->email;
    $otp = $data->otp;

    $query = "SELECT u.id FROM users u JOIN email_verification_tokens t ON u.id = t.user_id WHERE u.email = :email AND t.token = :token AND t.expires_at > UTC_TIMESTAMP() ORDER BY t.created_at DESC LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':token', $otp);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        // If this is just verification (not password reset), return success
        if ($action === 'verify_otp') {
            http_response_code(200);
            echo json_encode(["success" => true, "message" => "OTP verified successfully."]);
            exit();
        }

        // If this is password reset, check for new_password
        if (empty($data->new_password)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "New password is required."]);
            exit();
        }

        $new_password = $data->new_password;
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $user_id = $row['id'];

        $password_hash = password_hash($new_password, PASSWORD_BCRYPT);
        $update_query = "UPDATE users SET password = :password WHERE id = :id";
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(':password', $password_hash);
        $update_stmt->bindParam(':id', $user_id);

        if ($update_stmt->execute()) {
            // Delete the token after use
            $delete_query = "DELETE FROM email_verification_tokens WHERE user_id = :user_id";
            $delete_stmt = $db->prepare($delete_query);
            $delete_stmt->bindParam(':user_id', $user_id);
            $delete_stmt->execute();

            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Password has been reset successfully."]);
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to update password."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid or expired OTP."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid action."]);
}
?>