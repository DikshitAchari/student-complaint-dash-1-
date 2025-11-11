# Student Complaint Dashboard - Setup Guide

## Project Structure

```
student-complaint-dash (1)/
├── backend/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.php
│   │   │   └── register.php
│   │   ├── complaints/
│   │   │   ├── create.php
│   │   │   ├── get_all.php
│   │   │   ├── get_by_student.php
│   │   │   ├── get_stats.php
│   │   │   ├── update_admin_comments.php
│   │   │   └── update_status.php
│   │   └── users/
│   │       ├── change_password.php
│   │       └── update_profile.php
│   ├── config/
│   │   ├── cors.php
│   │   └── database.php
│   ├── database/
│   │   └── schema.sql
│   └── models/
│       ├── Complaint.php
│       └── User.php
├── public/
│   ├── js/
│   │   ├── app.js
│   │   └── config.js
│   └── index.html
└── style.css
```

## Prerequisites

1. **XAMPP** installed on your system
   - Download from: https://www.apachefriends.org/
   - Includes Apache, MySQL/MariaDB, and PHP

## Setup Instructions

### Step 1: Database Setup

1. Start XAMPP Control Panel
2. Start **Apache** and **MySQL** services
3. Open phpMyAdmin in your browser: `http://localhost/phpmyadmin`
4. Create database:
   - Click on "New" in the left sidebar
   - Enter database name: `student_complaints_db`
   - Click "Create"
5. Import schema:
   - Click on the newly created database
   - Go to "SQL" tab
   - Copy the contents of `backend/database/schema.sql`
   - Paste and click "Go"

### Step 2: Project Setup

1. Copy the entire project folder to XAMPP's `htdocs` directory:
   ```
   C:\xampp\htdocs\student-complaint-dash (1)\
   ```

2. Verify database configuration in `backend/config/database.php`:
   ```php
   private $host = "localhost";
   private $db_name = "student_complaints_db";
   private $username = "root";
   private $password = "";  // Default XAMPP has no password
   ```

3. If your XAMPP has a different MySQL password, update it in `database.php`

### Step 3: Access the Application

Open your browser and navigate to:
```
http://localhost/student-complaint-dash%20(1)/public/index.html
```

## Default Credentials

### Admin Account
- **USN:** ADMIN01
- **Password:** admin123

### Student Accounts
1. **Rahul Kumar**
   - USN: 4NI21CS101
   - Password: password123

2. **Priya Sharma**
   - USN: 4NI21EC045
   - Password: password123

## Features

### For Students:
- ✅ User Registration & Login
- ✅ Submit Complaints with details
- ✅ Track complaint status
- ✅ View complaint history
- ✅ Update profile information
- ✅ Change password
- ✅ Dashboard with statistics

### For Admins:
- ✅ View all complaints
- ✅ Update complaint status
- ✅ Add admin comments
- ✅ Manage complaint workflow

## API Endpoints

### Authentication
- **POST** `/backend/api/auth/login.php` - User login
- **POST** `/backend/api/auth/register.php` - User registration

### Complaints
- **POST** `/backend/api/complaints/create.php` - Create new complaint
- **GET** `/backend/api/complaints/get_by_student.php?student_id=X` - Get student complaints
- **GET** `/backend/api/complaints/get_all.php` - Get all complaints (admin)
- **POST** `/backend/api/complaints/update_status.php` - Update complaint status
- **POST** `/backend/api/complaints/update_admin_comments.php` - Add admin comments
- **GET** `/backend/api/complaints/get_stats.php?student_id=X` - Get complaint statistics

### User Management
- **POST** `/backend/api/users/update_profile.php` - Update user profile
- **POST** `/backend/api/users/change_password.php` - Change password

## Database Schema

### Tables

1. **users**
   - Stores user information (students & admins)
   - Fields: id, full_name, usn, email, password, role, department, year, contact

2. **complaints**
   - Stores complaint details
   - Fields: id, complaint_id, student_id, room_number, location, category, description, priority, status, images, admin_comments

3. **complaint_timeline**
   - Tracks complaint status changes
   - Fields: id, complaint_id, event, timestamp

## Troubleshooting

### Common Issues:

1. **"Connection error" message**
   - Ensure MySQL is running in XAMPP
   - Verify database credentials in `config/database.php`
   - Check if database `student_complaints_db` exists

2. **"Failed to connect to server" error**
   - Ensure Apache is running in XAMPP
   - Check if the project is in the correct `htdocs` folder
   - Verify the API URL in `public/js/config.js`

3. **CORS errors in browser console**
   - Ensure `backend/config/cors.php` is included in all API files
   - Check browser console for specific error messages

4. **404 errors on API calls**
   - Verify the folder name matches exactly (including spaces and parentheses)
   - Update `API_BASE_URL` in `public/js/config.js` if folder name is different

5. **White screen or blank page**
   - Check browser console for JavaScript errors
   - Ensure all script files are loaded correctly
   - Verify `index.html` is in the `public` folder

### If folder name has spaces:

Update `public/js/config.js`:
```javascript
const API_BASE_URL = 'http://localhost/your-actual-folder-name/backend/api';
```

## Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** PHP 7.4+
- **Database:** MySQL/MariaDB
- **Server:** Apache (via XAMPP)
- **Architecture:** RESTful API

## Security Features

- Password hashing using bcrypt
- SQL injection prevention using PDO prepared statements
- Input sanitization
- CORS protection
- Session management with localStorage

## Future Enhancements

- Email notifications
- File upload for complaint images
- Real-time notifications
- Analytics dashboard
- Export reports (PDF/Excel)
- Mobile responsive design improvements

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify XAMPP services are running
3. Check browser console for errors
4. Review PHP error logs in `xampp/apache/logs/error.log`

## License

This project is for educational purposes.
