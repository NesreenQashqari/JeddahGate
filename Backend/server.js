const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.get('/test', (req, res) => {
    res.json({ success: true, message: 'Server is working' });
});


const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'jeddahgate'
});

db.connect((err) => {
    if (err) {
        console.log('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});
app.post('/contact', (req, res) => {
    const { firstName, lastName, gender, dob, email, mobile, language, message } = req.body;

    // Backend validation
    if (!firstName || !lastName || !gender || !dob || !email || !mobile || !language || !message) {
        return res.json({ success: false, message: 'All fields are required' });
    }
    if (firstName.length < 2 || lastName.length < 2) {
        return res.json({ success: false, message: 'Name must be at least 2 characters' });
    }
    if (!/^[A-Za-z ]+$/.test(firstName) || !/^[A-Za-z ]+$/.test(lastName)) {
        return res.json({ success: false, message: 'Name must contain letters only' });
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        return res.json({ success: false, message: 'Invalid email format' });
    }
    if (!/^\+?[0-9]{9,15}$/.test(mobile)) {
        return res.json({ success: false, message: 'Invalid mobile number' });
    }
    if (message.length < 10) {
        return res.json({ success: false, message: 'Message must be at least 10 characters' });
    }

    // Sanitize
    const clean = (str) => str.trim().replace(/[<>]/g, '');
    const sql = `INSERT INTO contacts (first_name, last_name, gender, dob, email, mobile, language, message) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [
        clean(firstName), clean(lastName), clean(gender),
        dob, clean(email), clean(mobile),
        Array.isArray(language) ? language.join(', ') : clean(language),
        clean(message)
    ], (err) => {
        if (err) return res.json({ success: false, message: 'Database error' });
        res.json({ success: true, message: 'Message sent successfully!' });
    });
});

app.post('/review', (req, res) => {
    const { placeName, rating, reviewText, type } = req.body;
    console.log('Received:', req.body);
    if (!placeName || !rating || !reviewText) {
        return res.json({ success: false, message: 'All fields are required' });
    }
    if (reviewText.length < 10) {
        return res.json({ success: false, message: 'Review must be at least 10 characters' });
    }
    if (rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'Invalid rating' });
    }

    const clean = (str) => str.trim().replace(/[<>]/g, '');
    const sql = `INSERT INTO reviews (place_name, rating, review_text, type) VALUES (?, ?, ?, ?)`;
    console.log('type value:', type);
    db.query(sql, [clean(placeName), rating, clean(reviewText), type], (err) => {
        if (err) return res.json({ success: false, message: 'Database error' });
        res.json({ success: true, message: 'Review submitted successfully!' });
    });
});

app.get('/reviews', (req, res) => {
    db.query("SELECT * FROM reviews WHERE type = 'website' ORDER BY created_at DESC", (err, results) => {
        if (err) return res.json({ success: false, message: 'Database error' });
        res.json({ success: true, reviews: results });
    });
});

app.get('/reviews/place', (req, res) => {
    const placeName = req.query.name;
    if (!placeName) return res.json({ success: false, message: 'Place name required' });
    db.query("SELECT * FROM reviews WHERE type = 'place' AND place_name = ? ORDER BY created_at DESC", 
    [placeName], (err, results) => {
        if (err) return res.json({ success: false, message: 'Database error' });
        res.json({ success: true, reviews: results });
    });
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});

