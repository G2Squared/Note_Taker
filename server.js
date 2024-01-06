const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const uuid = require('uuid');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    const newNote = {
        title,
        text,
        id: uuid.v4(),
    };
    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Data has been written to db file.');
            return res.json(notes);
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        const notes = JSON.parse(data);
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id == id) {
                notes.splice(i, 1);
            }
        }
        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Data has been written to db file.');
            return res.json(notes);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});