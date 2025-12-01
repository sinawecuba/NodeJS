"use strict";

// === IMPORT MODULES ===
const mongoose = require("mongoose");              // Import Mongoose to interact with MongoDB
const Subscriber = require("./models/subscriber"); // Import the Subscriber model


// === CONNECT TO MONGODB ===
// Connects to a local MongoDB database named "recipe_db"
mongoose.connect(
  "mongodb://0.0.0.0:27017/recipe_db",
  { useNewUrlParser: true }
);

// Access the database connection (not used directly here, but established)
mongoose.connection;


// === SAMPLE DATA (CONTACTS) ===
// An array of objects representing subscribers that will be added to the database
let contacts = [
  {
    name: "James oliveira",
    email: "oliveira1james@.com", // Invalid email for demonstration
    zipCode: 10016
  },
  {
    name: "Chef Eggplant",
    email: "eggplant@recipeapp.com",
    zipCode: 20331
  },
  {
    name: "Professor Souffle",
    email: "souffle@recipeapp.com",
    zipCode: 19103
  }
];


// === CLEAR EXISTING SUBSCRIBERS ===
// Removes all documents in the "subscribers" collection before adding new ones
Subscriber.deleteMany()
  .exec() // Executes the deletion query
  .then(() => {
    console.log("✅ Subscriber data is empty!");
  });


// === CREATE SUBSCRIBERS FROM CONTACT LIST ===
let commands = [];

// Loop through each contact object
contacts.forEach(c => {
  // Push a promise returned by Subscriber.create() into the commands array
  commands.push(
    Subscriber.create({
      name: c.name,
      email: c.email
      // Note: zipCode not included — optional
    })
  );
});


// === EXECUTE ALL CREATION PROMISES ===
Promise.all(commands)
  .then(r => {
    // r contains an array of successfully created subscriber objects
    console.log("✅ Subscribers successfully created:");
    console.log(JSON.stringify(r, null, 2)); // Log results in formatted JSON

    // Close MongoDB connection when done
    mongoose.connection.close();
  })
  .catch(error => {
    // Logs any errors that occurred during creation
    console.log(`❌ ERROR: ${error}`);
  });
