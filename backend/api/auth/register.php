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

    // Validate email format (allow any valid email)
    if (!filter_var($user->email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "Please use a valid email address"));
        exit();
    }

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

    // Start a database transaction
    $db->beginTransaction();

    try {
        // 1. Create user (with email_verified = 0)
        if (!$user->create($db)) {
            throw new Exception("Unable to create user in the database.");
        }

        // Generate verification token (6-digit code)
        $token = rand(100000, 999999);

        // 2. Save token to database (expires in 5 minutes)
        if (!$user->saveVerificationToken($token, 300)) {
            throw new Exception("Failed to generate verification token.");
        }

        // 3. Send verification email
        $mail = getMailer();
        $mail->addAddress($user->email, $user->full_name);
        $mail->isHTML(true);
        $mail->Subject = 'Email Verification - Student Complaint System';
        $mail->Body = "
            <h2>Email Verification</h2>
            <p>Hello {$user->full_name},</p>
            <p>Thank you for registering. Please use the following code to verify your email:</p>
            <h3 style='color: #007bff; font-size: 24px;'>{$token}</h3>
            <p>This code will expire in 5 minutes.</p>
        ";
        $mail->send(); // This will throw an Exception on failure

        // If all steps succeeded, commit the transaction
        $db->commit();

        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Registration successful. Please check your email for a verification code.",
            "requires_verification" => true
        ]);

    } catch (Exception $e) {
        // If any step fails, roll back the entire transaction
        $db->rollBack();

        http_response_code(500);
        // Return the specific error message from PHPMailer or the database
        echo json_encode(["success" => false, "message" => "Registration failed: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(array("success" => false, "message" => "Incomplete data"));
}
?>