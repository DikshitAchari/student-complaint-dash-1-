HOW TO ADD BACKGROUND IMAGES TO LOGIN PAGES
=============================================

1. Place your background images in this folder (assets/images/)
   Example: login-bg.jpg, admin-bg.jpg

2. Open the style.css file and add these lines at the top of the :root section:

For Student Login Page:
  --auth-bg-image: url('../assets/images/your-image-name.jpg');

For Admin Login Page:
  --admin-auth-bg-image: url('../assets/images/your-admin-image-name.jpg');

Example:
-------
:root {
  --auth-bg-image: url('../assets/images/login-bg.jpg');
  --admin-auth-bg-image: url('../assets/images/admin-bg.jpg');
  
  /* ... rest of the CSS variables ... */
}

Notes:
------
- Supported formats: JPG, PNG, WebP
- Recommended size: 1920x1080px or larger
- The image will automatically be covered with a semi-transparent overlay
- Student login has 30% opacity overlay
- Admin login has 20% opacity overlay
