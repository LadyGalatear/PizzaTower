// Import Express module
import express from 'express';

// Create instance of Express app
const app = express();

// Define port number for server
const PORT = 3000;

// Enable static file serving
app.use(express.static('public'));

// Define our main route ('/')
app.get('/', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/home.html`);
});

// Contact route
app.get('/contact-us', (req, res) => {
    res.sendFile(`${import.meta.dirname}/views/contact.html`);
})

// Start server and listen on port
app.listen(PORT, () => {
    console.log(`Server is running with intent at http://localhost:${PORT}`);
});