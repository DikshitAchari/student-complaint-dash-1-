const { exec } = require('child_process');
const path = require('path');

console.log('\n🚀 Starting Student Complaint Dashboard...\n');

// Check if PHP is installed
exec('php -v', (error, stdout, stderr) => {
    if (error) {
        console.error('❌ ERROR: PHP is not installed or not in PATH');
        console.log('\n📋 Please install PHP or make sure XAMPP is installed:');
        console.log('   - If using XAMPP, add C:\\xampp\\php to your system PATH');
        console.log('   - Or download PHP from: https://www.php.net/downloads');
        process.exit(1);
    }
    
    console.log('✓ PHP is installed');
    console.log(stdout.split('\n')[0]);
    
    // Start the PHP built-in server
    console.log('\n📡 Starting development server...');
    console.log('   Local: http://localhost:8000');
    console.log('\n⚠️  IMPORTANT: Make sure MySQL is running (XAMPP Control Panel)');
    console.log('   - Start Apache and MySQL in XAMPP');
    console.log('   - Import database from backend/database/schema.sql');
    console.log('\n✓ Press Ctrl+C to stop the server\n');
    
    const server = exec('php -S localhost:8000 -t public', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${error.message}`);
            return;
        }
    });
    
    server.stdout.on('data', (data) => {
        console.log(data.toString());
    });
    
    server.stderr.on('data', (data) => {
        console.log(data.toString());
    });
});
