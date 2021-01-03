const express = require("express");
const path = require("path");
const dbJSON = require("./db/db.json");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const app = express(); // sets up express and server port
const PORT = process.env.PORT || 3000;

app.use(express.json()); // connects express for data handling
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));


app.get('/', (req, res) => { // sends user prebuilt html pages
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get("/note", (req, res) => {
  res.json(dbJSON);
});

app.get("/api/notes", (req, res) => {
  const notes = fs.readFileSync(path.join(__dirname, "./public/notes.html"));
  return res.json(notes);
});

app.post("/api/notes", function(req, res) {
  // Validate request body
  if(!req.body.title) {
    return res.json({error: "Missing required title"});
  }

  // Copy request body and generate ID
  const note = {...req.body, id: uuidv4()}

  // Push note to dbJSON array - saves data in memory
  dbJSON.push(note);

  // Saves data to file by persisting in memory variable dbJSON to db.json file.
  fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(dbJSON), (err) => {
    if (err) {
      return res.json({error: "Error writing to file"});
    }

    return res.json(note);
  });
});

app.delete('/api/notes/:id', function (req, res){
  const noteId = dbJSON.findIndex(item => {item.id == req.params.id});  
  console.log(noteId);

  dbJSON.splice(noteId,1);

  fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(dbJSON), (err) => {
    if (err) {
      return res.json({error: "Error writing to file"});
    }

    return res.json(note);
  });
});

app.get("*", function(req, res) { // catch all sends to homepage
  res.send("Sending you the homepage");
});

app.listen(PORT, function() { // starts the local server
  console.log("App listening on PORT " + PORT);
});
