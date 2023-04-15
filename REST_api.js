// Use express-module
var express = require("express");
var cors = require('cors')
var app = express();
app.use(cors())

// This for the templates
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose module
var mongoose = require("mongoose");


// Create connection script to db
const uri = "mongodb+srv://JerOjal:DsNLCSqCN5s0Ei0m@cluster0.sz7hujc.mongodb.net/songs?retryWrites=true&w=majority";

// Make connection to database
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Make schema to your data model
const Song = mongoose.model(
    "Song",
    {
        title: String,
        year: Number,
        artist: String,
    },
    "songs"
)
// Print the songs
app.get("/api/songs", function (req, res) {
    async function findSong() {
        try {
            var results = await Song.find({}, null, { limit: 20 });

            console.log(results);
            res.status(200).json(results);
        } catch (e) {
            console.error(e);
        } finally {
            //await Song.;
            //mongoose.connection.close();
            console.log("Request done!");
        }

    };
    findSong();
});


// Add one song - see how to read the POST parameters
app.post("/api/add", function (req, res) {
    console.log("Add song");
    res.send("Add song: " + req.body.artist + req.body.title + " (" + req.body.year + ")");
});

// Modify the information of song by ID number.See how to read the ID
app.put("/api/modify/:id", function (req, res) {
    console.log("Modify song by " + req.params.id);
    res.send("Modify song by " + req.params.id);
});

// Remove song by ID. See how to read the ID
app.delete("/api/remove/:id", function (req, res) {
    // Take the id for the delete operation
    var id = req.params.id;

    Song.findByIdAndDelete(id, function (err, results) {
        // Database error handling 
        if (err) {
            console.log(err);
            res.status(500).json("Fault in delete operation.");
        } // Tietokanta ok, but object cannot be found
        else if (results == null) {
            res.status(200).json("Cannot be deleted as object cannot be found.");
        } // Successful delete operation
        else {
            console.log(results);
            res.status(200).json("Deleted " + id + " " + results.title);
        }
    });
});

// Web server by express
var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
    console.log("Example app is listening on port %d", PORT);
});