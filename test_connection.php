<?php
/**
 * Database Connection Test
 * 
 * This file tests the database connection and displays the results.
 * Access it at: http://localhost/student-complaint-dash%20(1)/test_connection.php
 */

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Connection Test</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            max-width: 600px;
            width: 100%;
            padding: 40px;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        .status {
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 15px;
        }
        .success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .info {
            background: #d1ecf1;
            color: #0c5460;
            border: 1px solid #bee5eb;
        }
        .details {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
        }
        .details h3 {
            margin-bottom: 10px;
            color: #495057;
        }
        .detail-item {
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .detail-item:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #495057;
        }
        .value {
            color: #6c757d;
        }
        .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            margin-top: 20px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #5568d3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔌 Database Connection Test</h1>
        
        <?php
        include_once 'backend/config/database.php';
        
        $database = new Database();
        $db = $database->getConnection();
        
        if ($db) {
            echo '<div class="status success">';
            echo '<strong>✅ Success!</strong> Database connection established successfully.';
            echo '</div>';
            
            // Test query to count users
            try {
                $query = "SELECT COUNT(*) as count FROM users";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $userCount = $result['count'];
                
                $query2 = "SELECT COUNT(*) as count FROM complaints";
                $stmt2 = $db->prepare($query2);
                $stmt2->execute();
                $result2 = $stmt2->fetch(PDO::FETCH_ASSOC);
                $complaintCount = $result2['count'];
                
                echo '<div class="details">';
                echo '<h3>Database Statistics</h3>';
                echo '<div class="detail-item">';
                echo '<span class="label">Database Name:</span> ';
                echo '<span class="value">student_complaints_db</span>';
                echo '</div>';
                echo '<div class="detail-item">';
                echo '<span class="label">Total Users:</span> ';
                echo '<span class="value">' . $userCount . '</span>';
                echo '</div>';
                echo '<div class="detail-item">';
                echo '<span class="label">Total Complaints:</span> ';
                echo '<span class="value">' . $complaintCount . '</span>';
                echo '</div>';
                echo '<div class="detail-item">';
                echo '<span class="label">Server:</span> ';
                echo '<span class="value">localhost</span>';
                echo '</div>';
                echo '<div class="detail-item">';
                echo '<span class="label">PHP Version:</span> ';
                echo '<span class="value">' . phpversion() . '</span>';
                echo '</div>';
                echo '</div>';
                
                echo '<div class="status info">';
                echo '<strong>ℹ️ Next Steps:</strong><br>';
                echo '1. Your database is ready<br>';
                echo '2. You can now access the application<br>';
                echo '3. Use the default credentials to login';
                echo '</div>';
                
            } catch(PDOException $e) {
                echo '<div class="status error">';
                echo '<strong>⚠️ Database Query Error:</strong><br>';
                echo 'Tables may not exist. Please run the SQL schema from backend/database/schema.sql';
                echo '</div>';
            }
            
        } else {
            echo '<div class="status error">';
            echo '<strong>❌ Connection Failed!</strong><br>';
            echo 'Could not connect to the database. Please check:<br>';
            echo '• MySQL is running in XAMPP<br>';
            echo '• Database "student_complaints_db" exists<br>';
            echo '• Credentials in backend/config/database.php are correct';
            echo '</div>';
        }
        ?>
        
        <a href="setup.html" class="btn">← Back to Setup</a>
        <a href="public/index.html" class="btn">Launch Application →</a>
    </div>
</body>
</html>
