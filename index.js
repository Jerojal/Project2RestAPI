// Use express-module
var express = require("express");
var app = express();

// This for the templates
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo db module
const MongoClient = require("mongodb").MongoClient;

/* Let's take env parameters in use */
require("dotenv").config();

// Set userid and pw. 
var user = process.env.MONGO_USERID
var pw = process.env.MONGO_PW

// Create connection script to db

const uri = "mongodb+srv://" + user + ":" + pw + "@cluster0.ut6rylp.mongodb.net/?retryWrites=true&w=majority";

// Make the routes

// Print the movies
app.get("/api/getall", function (req, res) {
    // Create connection object
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    //res.send("Printout the movies.");

    async function connectAndFetch() {
        try {
            // Take connection to "sample_mflix" and collection "movies"
            //var data = "";
            await client.connect();
            const collection = client.db("sample_mflix").collection("movies");

            // make query with collection-object
            var result = await collection
                .find() // Use empty find to show all contents
                .limit(10)
                .toArray()

            res.send(result);

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
            console.log("Connection closed to MONGO");
        }
    }
    connectAndFetch();

});
const { ObjectId } = require("mongodb");

// Works when using id: in the following way: http://localhost:8080/api/573a1390f29313caabcd4323
app.get("/api/:id", function (req, res) {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    async function connectAndFetchOne() {
        try {
            await client.connect();
            const collection = client.db("sample_mflix").collection("movies");

            // Retrieve the id from the request parameters
            const id = req.params.id;

            // Check if the id is in a valid format
            if (!ObjectId.isValid(id)) {
                res.status(400).send("Invalid ID");
                return;
            }

            // Convert the id string to ObjectId
            const objectId = new ObjectId(id);

            // Update the query to find the document with the specified ObjectId
            var result = await collection.findOne({ _id: objectId });

            if (!result) {
                res.status(404).send("Document not found");
            } else {
                res.send(result);
            }
        } catch (e) {
            console.error(e);
            res.status(500).send("Internal Server Error");
        } finally {
            await client.close();
            console.log("Connection closed to MONGO");
        }
    }

    connectAndFetchOne();
});


// Add one movie
app.post("/api/add", function (req, res) {

    res.send("Add movie: " + req.body.title + " (" + req.body.year + ")");
});

// Modify the information of movie by ID number.
app.put("/api/update/:id", function (req, res) {
    res.send("Modify movie by " + req.params.id);
});

// Remove movie by ID. 
app.delete("/api/remove/:id", function (req, res) {
    res.send("Remove the movie by " + req.params.id);
});

// Web server by express
var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
    console.log("Example app is listening on port %d", PORT);
});