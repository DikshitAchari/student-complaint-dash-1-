<?php
// Router for PHP built-in server
// This router handles both frontend and API requests

// Get the requested URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Define API base path
$apiBase = '/backend/api';

// Check if this is an API request
if (strpos($uri, $apiBase) === 0) {
    // This is an API request
    // Extract the API file path
    $apiPath = substr($uri, strlen($apiBase));
    $apiFile = __DIR__ . '/backend/api' . $apiPath;
    
    // Check if the API file exists
    if (file_exists($apiFile) && is_file($apiFile)) {
        // Change to the directory of the API file to maintain correct relative paths
        $originalDir = getcwd();
        $apiDir = dirname($apiFile);
        chdir($apiDir);
        
        // Include the API file
        require basename($apiFile);
        
        // Change back to original directory
        chdir($originalDir);
        return true;
    } else {
        // API file not found
        http_response_code(404);
        echo json_encode(array("success" => false, "message" => "API endpoint not found"));
        return true;
    }
} else {
    // This is a frontend request
    // Serve static files from public directory
    $publicDir = __DIR__ . '/public';
    $filePath = $publicDir . $uri;
    
    // If requesting root, serve index.html
    if ($uri === '/' || $uri === '') {
        $filePath = $publicDir . '/index.html';
    }
    
    // Check if file exists
    if (file_exists($filePath) && is_file($filePath)) {
        // Serve the file
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $mimeType = 'text/html';
        
        switch ($extension) {
            case 'css':
                $mimeType = 'text/css';
                break;
            case 'js':
                $mimeType = 'application/javascript';
                break;
            case 'json':
                $mimeType = 'application/json';
                break;
            case 'png':
                $mimeType = 'image/png';
                break;
            case 'jpg':
            case 'jpeg':
                $mimeType = 'image/jpeg';
                break;
            case 'gif':
                $mimeType = 'image/gif';
                break;
            case 'svg':
                $mimeType = 'image/svg+xml';
                break;
        }
        
        header('Content-Type: ' . $mimeType);
        readfile($filePath);
        return true;
    } else {
        // File not found, serve index.html for SPA routing
        $indexPath = $publicDir . '/index.html';
        if (file_exists($indexPath)) {
            header('Content-Type: text/html');
            readfile($indexPath);
            return true;
        }
    }
}

// If we get here, return 404
http_response_code(404);
echo '404 Not Found';
return true;
?>