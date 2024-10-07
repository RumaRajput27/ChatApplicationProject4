const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware to parse the body of POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the login form at "/login"
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve the message form at "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'message.html'));
});

// Handle the message form submission
app.post('/send-message', (req, res) => {
  const { username, message } = req.body;

  const data = {
    username,
    message
  };

  // Append the data to the file
  fs.appendFile('messages.json', JSON.stringify(data) + '\n', (err) => {
    if (err) {
      console.error('Error writing to file', err);
      res.status(500).send('Error saving message');
    } else {
      res.send('Message received and stored!');
    }
  });
});

// Route to read messages from the file
app.get('/messages', (req, res) => {
  fs.readFile('messages.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file', err);
      return res.status(500).send('Error reading messages');
    }

    // Split the file by new lines to get each message as JSON
    const messages = data.split('\n').filter(line => line).map(JSON.parse);

    res.json(messages); // Send the messages as JSON response
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
