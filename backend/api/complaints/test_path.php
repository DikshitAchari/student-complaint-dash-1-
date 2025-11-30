<?php
// Test to see what the current working directory is
echo "Current working directory: " . getcwd() . "\n";
echo "Script location: " . __DIR__ . "\n";
echo "Full path to this script: " . __FILE__ . "\n";

// Test if we can find the config files
$configPath = __DIR__ . '/../../config/database.php';
echo "Looking for config at: " . $configPath . "\n";
echo "File exists: " . (file_exists($configPath) ? "Yes" : "No") . "\n";
?>