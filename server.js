const express = require("express");
const apiRoutes = require("./routes/apiRoutes");
const path = require("path");
const dbJSON = require("./db/db.json");
const store = require("./db/store");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const app = express(); // sets up express and server port
const PORT = process.env.PORT || 3000;

app.use(express.json()); // connects express for data handling
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use("/api", apiRoutes);

app.get('/', (req, res) => { // sends user prebuilt html pages
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get("*", function(req, res) { // catch all sends to homepage
  res.send("Sending you the homepage");
});

app.listen(PORT, function() { // starts the local server
  console.log("App listening on PORT " + PORT);
});
