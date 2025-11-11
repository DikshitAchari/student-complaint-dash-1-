@echo off
echo.
echo ========================================
echo   Student Complaint Dashboard
echo ========================================
echo.
echo Starting development server...
echo.
echo Server will run at: http://localhost:8000
echo.
echo IMPORTANT: Make sure MySQL is running!
echo  - Open XAMPP Control Panel
echo  - Start Apache and MySQL services
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

C:\xampp\php\php.exe -S localhost:8000 -t public
