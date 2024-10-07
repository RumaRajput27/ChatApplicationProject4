const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Serve send message page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'message.html'));
});

// Serve contact us page
app.get('/contactus', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contactus.html'));
});

// Handle contact form submission
app.post('/contactus', (req, res) => {
    const { name, email } = req.body;
    
    // Log the details (or you could store it in a file/database)
    console.log(`Received contact from: Name = ${name}, Email = ${email}`);
    
    // Redirect to the success page
    res.redirect('/success');
});

// Serve success page after form submission
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'success.html'));
});

// Save message to file when submitted from main page
app.post('/send-message', (req, res) => {
    const { username, message } = req.body;

    const data = { username, message };

    fs.appendFile(path.join(__dirname, 'messages.json'), JSON.stringify(data) + '\n', (err) => {
        if (err) {
            return res.status(500).send('Error saving message');
        }
        res.send('Message received and stored!');
    });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
