-- Create Database
CREATE DATABASE IF NOT EXISTS student_complaints_db;
USE student_complaints_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    usn VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    department VARCHAR(100),
    year VARCHAR(50),
    contact VARCHAR(20),
    email_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usn (usn),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(50) UNIQUE NOT NULL,
    student_id INT NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    usn VARCHAR(50) NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    images TEXT,
    admin_comments TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_status (status),
    INDEX idx_complaint_id (complaint_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Complaint Timeline Table
CREATE TABLE IF NOT EXISTS complaint_timeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT NOT NULL,
    event VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    INDEX idx_complaint_id (complaint_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (ONLY ONE ADMIN ALLOWED)
-- Admin USN: ADMIN01
-- Admin Password: admin123
INSERT INTO users (full_name, usn, email, password, role) 
VALUES ('System Administrator', 'ADMIN01', 'admin@college.edu.in', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON DUPLICATE KEY UPDATE usn = usn;

-- Prevent multiple admin accounts with a check constraint
DELIMITER $$
CREATE TRIGGER prevent_multiple_admins
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    DECLARE admin_count INT;
    IF NEW.role = 'admin' THEN
        SELECT COUNT(*) INTO admin_count FROM users WHERE role = 'admin';
        IF admin_count >= 1 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Only one admin account is allowed';
        END IF;
    END IF;
END$$
DELIMITER ;

-- Insert sample student users
INSERT INTO users (full_name, usn, email, password, role, department, year, contact) 
VALUES 
('Rahul Kumar', '4NI21CS101', 'rahul.kumar@college.edu.in', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Computer Science', '3rd Year', '+91 98765 43210'),
('Priya Sharma', '4NI21EC045', 'priya.sharma@college.edu.in', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Electronics', '2nd Year', '+91 98765 43211')
ON DUPLICATE KEY UPDATE usn = usn;
-- Default password is 'password123' for both
