// Import Express module
import express from 'express';

// Import the mysql2 module
// mysql2 allows Node.js to communicate with a MySQL database
import mysql2 from 'mysql2';

import dotenv from 'dotenv';

// Load environment variables from .env file
// This MUST be called before accessing process.env
dotenv.config();

// Create instance of Express app
const app = express();

const pool = mysql2.createPool({
    // These values come from the .env file
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

// Database test - http://localhost:3000/db-test to test this route
app.get('/db-test', async(req, res) => {
    /* 
     * 'async' tells JavaScript that this function will do asynchronous work
     * Asynchronous means "it takes time to complete" (like waiting for
     * database). By marking it 'async', we can use 'await' inside it
     * 
     * 'await' keyword means "pause here and wait for the database to respond"
     * pool.query() returns a Promise ("I'll get back to you!")
     * 'await' waits for the Promise to complete before moving on
     * 
     * DESTRUCTURING with [orders]:
     * pool.query() returns an ARRAY with 2 items:
     *   [0] = the actual data rows from the database
     *   [1] = metadata about the query (field names, types, etc.)
     * By writing [orders], we're saying "just give me the first item"

     * This is called "array destructuring"
     * So 'orders' now contains just the data rows, like:
     * [ {id: 1, customer: 'John', pizza: 'Pepperoni'}, 
     *   {id: 2, customer: 'Jane', pizza: 'Veggie'} ]
     */

    // try/catch block for error handling
    try {
        const [pizza_orders] = await pool.query('SELECT * FROM orders');

        // Send the orders data back to the browser as JSON
        res.send(pizza_orders[0]);

    } catch(err) {

        // If ANY error happened in the 'try' block, this code runs
        // Log the error to the server console (for developers to see)
        console.error('Database error:', err);

        // Send an error response to the browser
        // status(500) means "Internal Server Error"
        res.status(500).send('Database error: ' + err.message);
    }
});

// Define port number for server
const PORT = 3000;

// Enable static file serving
app.use(express.static('public'));

// Set EJS as view engine
app.set('view engine', 'ejs');

// "Middleware" that lets express read form data and store in req.body
app.use(express.urlencoded ({ extended: true }));

// Define our main route ('/')
app.get('/', (req, res) => {
    res.render(`home`);
});

// Contact route
app.get('/contact-us', (req, res) => {
    res.render(`contact`);
})

// Confirmation route
app.get('/thank-you', (req, res) => {
    res.render(`confirmation`);
})

// Confirmation route
app.post('/submit-order', async(req, res) => {

    const order = req.body;

    const params = [
        order['first-name'],
        order['last-name'],
        order['email-address'],
        order.method,
        order.size,
        Array.isArray(order.toppings) ? order.toppings.join(", ") : "none"
    ];

    // Insert a new order into the database
    const sql = `insert into orders (first_name, last_name, email_address, method, size, toppings)
                values (?, ?, ?, ?, ?, ?)`;

    const result = await pool.execute(sql, params);

    res.render(`confirmation`, { order });
});

// Admin route - displays all orders from the database

app.get('/admin', async(req, res) => {
    try {
        // Fetch all orders from the database, newest first
        let sql = "select * from orders order by timestamp desc";
        const orders = await pool.query(sql);
        console.log(orders);

        // Render the admin page with the orders
        res.render('admin', { orders: orders[0] });

    } catch(err) {

        console.error('Database error:', err);
        res.status(500).send('Database error: ' + err.message);
    }
});

// Start server and listen on port
app.listen(PORT, () => {
    console.log(`Server is running with intent at http://localhost:${PORT}`);
});