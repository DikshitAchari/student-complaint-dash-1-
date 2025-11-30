<?php
// Test script for email functionality
include_once 'backend/config/mailer.php';

try {
    $mail = getMailer();
    $mail->addAddress('dikshitachari05@gmail.com', 'Test User');
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = 'Test Email - Student Complaint System';
    $mail->Body = "
        <h2>Test Email</h2>
        <p>This is a test email from the Student Complaint System.</p>
    ";
    
    if ($mail->send()) {
        echo "Email sent successfully!\n";
    } else {
        echo "Failed to send email!\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>