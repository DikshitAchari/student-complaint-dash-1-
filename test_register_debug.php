<?php
// Test registration with debugging
$data = array(
    "full_name" => "Test User Debug",
    "usn" => "TESTDEBUG",
    "email" => "testdebug@example.com",
    "password" => "password123",
    "role" => "student"
);

$context = stream_context_create([
    "http" => [
        "header" => "Content-Type: application/json\r\n",
        "method" => "POST",
        "content" => json_encode($data),
    ]
]);

echo "Sending request...\n";
$result = file_get_contents('http://localhost:8000/backend/api/auth/register.php', false, $context);

// Print response headers
echo "Response headers:\n";
foreach ($http_response_header as $header) {
    echo $header . "\n";
}
echo "\n";

// Print response body
echo "Response body:\n";
echo $result . "\n";
?>