require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { userModel } = require('./models/user');

// Import routes
const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');
const adminRouter = require('./routes/admin');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:8080',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Flash messages
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Global variables middleware
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// Set user information for all routes
app.use(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);
            const user = await userModel.getUserById(decoded.id);
            console.log('Found user:', user);
            if (user) {
                req.user = user;
                res.locals.user = user; // Make user available in templates
                console.log('Set user in request:', req.user);
            }
        }
        next();
    } catch (error) {
        console.error('Error setting user info:', error);
        next();
    }
});

// Routes
app.use('/posts', postsRouter);
app.use('/auth', authRouter);
app.use('/mng1515', adminRouter);

// Main page route
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Home',
        user: req.user 
    });
});

app.get('/chatbot', (req, res) => {
    res.render('chatbot', { 
        title: 'Chatbot',
        user: req.user 
    });
});

// Add this route in app.js
app.get('/finder', (req, res) => {
    res.render('finder', { title: 'File Finder' });
});

// Base directory setting
const baseDirectory = path.join(__dirname, 'public');

app.get('/list-files', (req, res) => {
    const directoryPath = req.query.directoryPath || baseDirectory;
    const fullPath = path.join(baseDirectory, directoryPath);

    fs.readdir(fullPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading directory' });
        }
        res.json(files);
    });
});

app.get('/read-file', (req, res) => {
    const filePath = req.query.filePath; // File path entered by the user
    const fullPath = path.join(__dirname, filePath); // Combine paths

    // Read file
    fs.readFile(fullPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.send(data);
    });
});

app.get('/link-preview', async (req, res) => {

    const { url } = req.query;

    console.log('preview request - ', url);

    try {
        const response = await axios.get(url, { timeout: 3000 });
        const $ = cheerio.load(response.data);

        const title = $('meta[property="og:title"]').attr('content') || $('title').text();
        const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
        const image = $('meta[property="og:image"]').attr('content');

        res.json({
            title: title || 'No title',
            description: description || '',
            image,
            url
        });
    } catch (err) {
        console.error('Link preview fetch error:', err.message);
        res.status(400).json({ error: 'Failed to fetch preview' });
    }
});

// 404 error handling
app.use((req, res) => {
    res.status(404).render('404', { 
        title: '404 Not Found',
        user: req.user
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Server Error',
        message: 'A server error has occurred.',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

module.exports = app; 