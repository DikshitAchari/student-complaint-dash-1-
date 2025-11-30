<?php
// Test the reset password endpoint directly
include_once 'backend/config/cors.php';
include_once 'backend/config/database.php';
include_once 'backend/config/mailer.php';
include_once 'backend/models/User.php';

// Simulate the POST data
$data = json_decode('{"action":"send_reset_otp","email":"dikshitachari05@gmail.com"}');

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

    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);
    
    $user->email = $data->email;
    // Check if user exists
    if (!$user->getUserByEmail()) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No user found with that email address."]);
        exit();
    }

    // Generate verification token (6-digit code)
    $token = rand(100000, 999999);
    
    // Save token to database with 5-minute expiry
    if ($user->saveVerificationToken($token, 300)) {
        try {
            // Send verification email
            $mail = getMailer();
            $mail->addAddress($user->email, $user->full_name);
            
            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Password Reset - Student Complaint System';
            $mail->Body = "
                <h2>Password Reset Request</h2>
                <p>Hello {$user->full_name},</p>
                <p>We received a request to reset your password. Please use the following verification code to complete the process:</p>
                <h3 style='color: #007bff; font-size: 24px;'>{$token}</h3>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't request a password reset, please ignore this email.</p>
                <br>
                <p>Best regards,<br>Student Complaint System Team</p>
            ";
            
            if ($mail->send()) {
                http_response_code(200);
                echo json_encode(["success" => true, "message" => "Password reset OTP has been sent to your email."]);
            } else {
                http_response_code(500);
                echo json_encode(["success" => false, "message" => "Failed to send verification email"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["success" => false, "message" => "Failed to send verification email: " . $e->getMessage()]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to generate reset token."]);
    }
}
?>