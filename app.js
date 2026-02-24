// Import Express module
import express from 'express';

// Create instance of Express app
const app = express();

// Define port number for server
const PORT = 3000;

// Enable static file serving
app.use(express.static('public'));

// Set EJS as view engine
app.set('view engine', 'ejs');

// "Middleware" that lets express read form data and store in req.body
app.use(express.urlencoded ({ extended: true }));

// Create temp array to store orders
const orders = [];

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
app.post('/submit-order', (req, res) => {
    const order = {
        first_name: req.body['first-name'],
        last_name: req.body['last-name'],
        email_address: req.body['email-address'],
        method: req.body.method,
        size: req.body.size,
        toppings: req.body.toppings ? req.body.toppings : "none",
        comment: req.body.comment,
        timestamp: new Date()
    };

    orders.push(order);

    res.render(`confirmation`, { order });
});

// Admin route
app.get('/admin', (req, res) => {
    res.render('admin', { orders });
})

// Start server and listen on port
app.listen(PORT, () => {
    console.log(`Server is running with intent at http://localhost:${PORT}`);
});