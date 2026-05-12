// import required packages
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors()); // so frontend can communicate with backend
app.use(express.json()); // allows the server to read JSON data sent from frontend 
app.use(express.urlencoded({ extended: true })); // allows the server to read data from form submissions
app.use(cors({ origin: '*' }));

// to test route and database connection
app.get('/test', (req, res) => {
    res.json({ success: true, message: 'Server is working' });
});

// database connection 
// stored in a var called 'db'
const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'jeddahgate'
});

// this to check the status of the connection
// and show the appropriate message 
// => is just good practice instead of function
// => means "do this"
db.connect((err) => {
    if (err) {
        console.log('Database connection failed:', err.message);
        return;
    }
    console.log('Connected to MySQL database');
});

// ----- this is for the 'contact us' form ----- 
// listen to data sent from our contact us form
//storing all the form data in 'req.body'
app.post('/contact', (req, res) => {
    const { firstName, lastName, gender, dob, email, mobile, language, message } = req.body;

    // Backend validation
    // if all the fields are empty = send warning message 
    if (!firstName || !lastName || !gender || !dob || !email || !mobile || !language || !message) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    // check the length of the names 
    if (firstName.length < 2 || lastName.length < 2) {
        return res.json({ success: false, message: 'Name must be at least 2 characters' });
    }

    // using pattern to only allow letters and space in the names fields 
    if (!/^[A-Za-z ]+$/.test(firstName) || !/^[A-Za-z ]+$/.test(lastName)) {
        return res.json({ success: false, message: 'Name must contain letters only' });
    }

    //using pattern again to check email to be in format 
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        return res.json({ success: false, message: 'Invalid email format' });
    }
   
    // this supports +966 and 05 and for each we defind condition to fit each one 
   if (mobile.startsWith('05')) {
    if (mobile.length !== 10) {
        return res.json({ success: false, message: 'Mobile number must be exactly 10 digits' });
    }
    if (!/^05[0-9]{8}$/.test(mobile)) {
        return res.json({ success: false, message: 'Invalid mobile number format' });
    }
} else if (mobile.startsWith('+966')) {
    if (mobile.length !== 13) {
        return res.json({ success: false, message: 'Mobile number must be exactly 13 characters' });
    }
    if (!/^\+966[0-9]{9}$/.test(mobile)) {
        return res.json({ success: false, message: 'Invalid mobile number format' });
    }
} else {
    return res.json({ success: false, message: 'Mobile must start with 05 or +966' });
}
    //check message length
    if (message.length < 10) {
        return res.json({ success: false, message: 'Message must be at least 10 characters' });
    }

    //------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------


    // Sanitize
    // function to remove the blank space before and after data

    const clean = (str) => str.trim();
    // add new row to my contact table 
    // adding a placeholder to replace the real value safely preventing attack on our DB 
    const sql = `INSERT INTO contacts (first_name, last_name, gender, dob, email, mobile, language, message) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    

    // this send the SQL query to the db it has 3 parts 'parameters'
    // 1 sq =query with the placeholder 
    // 2 cleaned values that will replace ?
    // 3 fail or success
    db.query(sql, [
        clean(firstName), clean(lastName), clean(gender),
        dob, clean(email), clean(mobile),
        Array.isArray(language) ? language.join(', ') : clean(language), // if user choose multiple languages 
        clean(message)
    ], (err) => {
        if (err) return res.json({ success: false, message: 'Database error' }); // if something went wrong 
        res.json({ success: true, message: 'Message sent successfully!' }); // if everything went well 
    });
});

    //------------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------------
 
    // --- this is for the review part for our website and the discover page ---
    // listen to data sent from our contact us form
    //saving the data in 'req.body'
    app.post('/review', (req, res) => {
    const { placeName, rating, reviewText, type } = req.body;

    // print the received data in the terminal 
    // this part is mainly for debugging and testing 
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
    
    // trim whitespace and remove potentially harmful characters
    const clean = (str) => str.trim().replace(/[<>]/g, '');

    // insert a row with 4 columns and use placeholder ? for the backend validation part in our project 

    const sql = `INSERT INTO reviews (place_name, rating, review_text, type) VALUES (?, ?, ?, ?)`;
    console.log('type value:', type);

    // this send the SQL query to the db it has 3 parts 'parameters'
    // 1 sq =query with the placeholder 
    // 2 cleaned values that will replace ?
    // 3 fail or success
    db.query(sql, [clean(placeName), rating, clean(reviewText), type], (err) => {
        if (err) return res.json({ success: false, message: 'Database error' });
        res.json({ success: true, message: 'Review submitted successfully!' });
    });
});

// showcase the reviews on our website
// get to fetch the data from the server
app.get('/reviews', (req, res) => {
    db.query("SELECT * FROM reviews WHERE type = 'website' ORDER BY created_at DESC", (err, results) => {
        if (err) return res.json({ success: false, message: 'Database error' });
        res.json({ success: true, reviews: results });
    });
});

// showcase the reviews on the places in the discover page 
//this one for the discover page (specific places)
app.get('/reviews/place', (req, res) => {
    const placeName = req.query.name;  // req query used with GET, it extracts the place name from the query string. e.g. ?name=Mr.Hakans

// validate that a place name was provided before querying the database
    if (!placeName) return res.json({ success: false, message: 'Place name required' });

    // fetch all reviews for this specific place from the database
    // only get reviews where type is 'place' and place_name matches
    // order by newest first
    
    db.query("SELECT * FROM reviews WHERE type = 'place' AND place_name = ? ORDER BY created_at DESC", 
    [placeName], (err, results) => {
        if (err) return res.json({ success: false, message: 'Database error' });
        res.json({ success: true, reviews: results });
    });
});

// start server 
app.listen(4000, () => {
    console.log('Server running on port 4000');
});