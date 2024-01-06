const express = require('express'); // Require the Express.js framework
const path = require('path'); // Require the 'path' module for working with file and directory paths
const noteData = require('./db/db.json'); // Access the note data from the 'db.json' file
const uuid = require('uuid'); // Use 'uuid' to create universally unique identifiers

const fs = require('fs'); // Require the 'fs' module to read and write to files

const PORT = process.env.PORT || 3001; // Define the port for the server to listen on

const app = express(); // Create an Express application

app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(express.json()); // Middleware for parsing JSON
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data

// Route to the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html')); // Send the 'index.html' file
});

// Route to the notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html')); // Send the 'notes.html' file
});

// API route to get all notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', function (err, data) {
        var notes = JSON.parse(data); // Parse the JSON data from 'db.json'
        res.json(notes); // Send the notes as a JSON response
    });
});

// API route to create a new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body; // Destructure the request body to get title and text

    const newNote = { // Create a new note object
        title,
        text,
        id: uuid.v4(), // Generate a unique ID for the note
    };
    
    fs.readFile('./db/db.json', 'utf8', function (err, data) {
       var notes = JSON.parse(data); // Parse the existing notes from 'db.json'
       notes.push(newNote); // Add the new note to the array
       fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => err ? console.error(err) : console.log('Data has been written to db file.'));
    })
    
    return res.json(noteData); // Return the response
});

// API route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id; // Get the note ID from the request parameters

    fs.readFile('./db/db.json', 'utf8', function (err, data) {
        var notes = JSON.parse(data); // Parse the existing notes from 'db.json'

        for(let i = 0; i < notes.length; i++){
            if(notes[i].id == id){
                notes.splice(i, 1); // Remove the note with the matching ID
            }
        }

        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => err ? console.error(err) : console.log('Data has been written to db file.'));
    });

    return res.json(noteData); // Return the response
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
