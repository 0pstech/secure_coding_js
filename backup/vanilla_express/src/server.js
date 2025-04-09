require('dotenv').config();
const app = require('./app');

const port = process.env.PORT || 8080;
const host = '0.0.0.0'; // Listen on all network interfaces

// Start server
const server = app.listen(port, host, () => {
    console.log(`Server is running on ${host}:${port}`);
    console.log(`You can access the server at http://${host}:${port}`);
});

// Handle server shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
}); 