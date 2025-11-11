# Student Complaint Dashboard 🎓

A complete, professional student complaint management system with PHP backend and MySQL database.

## ✨ Features

### For Students
- 📝 Submit complaints with detailed information
- 📊 Track complaint status in real-time
- 🔍 View complaint history and timeline
- 👤 Manage profile and change password
- 📈 Dashboard with statistics

### For Administrators
- 🎯 View all submitted complaints
- ✅ Update complaint status
- 💬 Add admin comments
- 📋 Complete complaint management workflow

## 🚀 Quick Start

### Prerequisites
- XAMPP installed (includes Apache, MySQL, PHP)

### Installation Steps

1. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache and MySQL services

2. **Copy Project**
   - Place this folder in: `C:\xampp\htdocs\`

3. **Setup Database**
   - Open: `http://localhost/phpmyadmin`
   - Create database: `student_complaints_db`
   - Import: `backend/database/schema.sql`

4. **Access Application**
   - Open: `http://localhost/student-complaint-dash%20(1)/setup.html`
   - Follow the setup instructions
   - Click "Launch Application"

## 🔐 Default Credentials

| Role | USN | Password |
|------|-----|----------|
| Admin | ADMIN01 | admin123 |
| Student | 4NI21CS101 | password123 |
| Student | 4NI21EC045 | password123 |

## 📁 Project Structure

```
student-complaint-dash (1)/
├── backend/               # PHP Backend
│   ├── api/              # REST API endpoints
│   ├── config/           # Configuration files
│   ├── database/         # SQL schema
│   └── models/           # PHP models
├── public/               # Frontend
│   ├── js/              # JavaScript files
│   └── index.html       # Main application
├── style.css            # Styles
├── setup.html           # Setup guide
└── SETUP_GUIDE.md       # Detailed documentation
```

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** PHP 7.4+
- **Database:** MySQL/MariaDB
- **Server:** Apache
- **Architecture:** RESTful API

## 📖 Documentation

For detailed setup instructions, troubleshooting, and API documentation, see:
- `SETUP_GUIDE.md` - Complete setup guide
- `setup.html` - Interactive setup page

## 🔧 Configuration

If your XAMPP MySQL has a password, update `backend/config/database.php`:

```php
private $password = "your_password";  // Replace with your password
```

## 🎯 Key Functionalities

1. **User Management**
   - Secure registration and login
   - Password hashing with bcrypt
   - Role-based access control

2. **Complaint Management**
   - Create, read, update complaints
   - Status tracking (Open → In Progress → Resolved → Closed)
   - Timeline tracking for each complaint

3. **Admin Panel**
   - View all complaints
   - Update status
   - Add comments

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login.php` - Login
- `POST /api/auth/register.php` - Register

### Complaints
- `POST /api/complaints/create.php` - Create complaint
- `GET /api/complaints/get_by_student.php` - Get student complaints
- `GET /api/complaints/get_all.php` - Get all complaints
- `POST /api/complaints/update_status.php` - Update status
- `POST /api/complaints/update_admin_comments.php` - Add comments

### Users
- `POST /api/users/update_profile.php` - Update profile
- `POST /api/users/change_password.php` - Change password

## 🔒 Security Features

- ✅ Password hashing (bcrypt)
- ✅ SQL injection prevention (PDO prepared statements)
- ✅ Input sanitization
- ✅ CORS protection
- ✅ Secure session management

## 🐛 Troubleshooting

**Database connection error?**
- Ensure MySQL is running in XAMPP
- Verify database name is `student_complaints_db`
- Check credentials in `backend/config/database.php`

**API not working?**
- Ensure Apache is running
- Check folder name matches in `public/js/config.js`
- Verify file paths are correct

**Page not loading?**
- Check browser console for errors
- Ensure all files are in correct locations
- Clear browser cache

## 📊 Database Schema

### Tables
- **users** - User accounts (students & admins)
- **complaints** - Complaint records
- **complaint_timeline** - Status change history

## 🚀 Getting Started

1. Visit `http://localhost/student-complaint-dash%20(1)/setup.html`
2. Follow the setup instructions
3. Launch the application
4. Login with default credentials
5. Start managing complaints!

## 📞 Support

For issues:
1. Check `SETUP_GUIDE.md`
2. Review browser console for errors
3. Check XAMPP error logs

## 📄 License

Educational Project - Free to use and modify

---

**Made with ❤️ for better campus complaint management**
