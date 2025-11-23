<?php
// PHPMailer configuration
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Load Composer's autoloader with correct path
require_once __DIR__ . '/../vendor/autoload.php';

function getMailer() {
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    // Enable verbose debug output for testing (remove in production)
    // $mail->SMTPDebug = SMTP::DEBUG_SERVER; 
    $mail->Host       = 'smtp.gmail.com'; // Set the SMTP server to send through
    $mail->SMTPAuth   = true;
    $mail->Username   = 'dikshitachari05@gmail.com'; // <-- CHANGE THIS to your actual Gmail address
    $mail->Password   = 'ypxkznkpzxsrlpig'; // <-- CHANGE THIS to your 16-character Google App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    
    // Recipients
    $mail->setFrom('dikshitachari05@gmail.com', 'Student Complaint System'); // <-- CHANGE THIS to your actual Gmail address
    
    return $mail;
}
?>