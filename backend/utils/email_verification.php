<?php
include_once __DIR__ . '/../config/mailer.php';

/**
 * Generates a 6-digit verification code
 * 
 * @return int The generated verification code
 */
function generateVerificationCode() {
    return rand(100000, 999999);
}

/**
 * Sends a verification email to the user
 * 
 * @param string $email The recipient's email address
 * @param string $usn The user's USN
 * @param string $verificationCode The verification code to send
 * @return bool True if email was sent successfully, false otherwise
 */
function sendVerificationEmail($email, $usn, $verificationCode) {
    try {
        $mail = getMailer();
        $mail->addAddress($email, $usn);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Password Reset - Student Complaint System';
        $mail->Body = "
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password for your Student Complaint System account.</p>
            <p>Please use the following verification code to complete the password reset process:</p>
            <h3 style='color: #007bff; font-size: 24px;'>{$verificationCode}</h3>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <br>
            <p>Best regards,<br>Student Complaint System Team</p>
        ";
        
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Failed to send verification email: " . $e->getMessage());
        return false;
    }
}
?>