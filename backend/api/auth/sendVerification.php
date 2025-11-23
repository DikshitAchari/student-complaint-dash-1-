<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';
include_once '../../config/mailer.php';
include_once '../../models/User.php';

// Set timezone to UTC to prevent expiry issues
date_default_timezone_set('UTC');

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email)) {
    $user->email = $data->email;
    
    // Check if user exists and is not verified
    if ($user->getUserByEmail() && !$user->email_verified) {
        // Generate verification token (6-digit code)
        $token = rand(100000, 999999);
        
        // Save token to database with 1-hour expiry
        if ($user->saveVerificationToken($token, 3600)) {
            try {
                // Send verification email
                $mail = getMailer();
                $mail->addAddress($user->email, $user->full_name);
                
                // Content
                $mail->isHTML(true);
                $mail->Subject = 'Email Verification - Student Complaint System';
                $mail->Body = "
                    <h2>Email Verification</h2>
                    <p>Hello {$user->full_name},</p>
                    <p>Thank you for registering with the Student Complaint System. Please use the following verification code to complete your registration:</p>
                    <h3 style='color: #007bff; font-size: 24px;'>{$token}</h3>
                    <p>This code will expire in 1 hour.</p>
                    <p>If you didn't register for this service, please ignore this email.</p>
                    <br>
                    <p>Best regards,<br>Student Complaint System Team</p>
                ";
                
                $mail->send();
                
                http_response_code(200);
                echo json_encode(array("success" => true, "message" => "Verification code sent to your email"));
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(array("success" => false, "message" => "Failed to send verification email"));
            }
        } else {
            http_response_code(500);
            echo json_encode(array("success" => false, "message" => "Failed to generate verification token"));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "User not found or already verified"));
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Email is required"));
}
?>