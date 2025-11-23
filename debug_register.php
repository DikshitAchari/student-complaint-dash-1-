<?php
// Debug registration script
$data = array(
    "full_name" => "Test User 3",
    "usn" => "TEST003",
    "email" => "test3@example.com",
    "password" => "password123",
    "role" => "student"
);

echo "Sending data: " . json_encode($data) . "\n";

$context = stream_context_create([
    "http" => [
        "header" => "Content-Type: application/json\r\n",
        "method" => "POST",
        "content" => json_encode($data),
    ]
]);

$result = file_get_contents('http://localhost:8000/backend/api/auth/register.php', false, $context);

echo "HTTP Response Code: " . implode(' ', $http_response_header) . "\n";
echo "Response Body: " . $result . "\n";
?>