"use strict"; // Enforce strict mode for safer and cleaner JavaScript

// === IMPORT MODULES ===
const mongoose = require("mongoose");        // Mongoose ODM for MongoDB
const Subscriber = require("./models/subscriber"); // Subscriber model

// === CONNECT TO MONGODB ===
mongoose.connect(
  "mongodb://0.0.0.0:27017/recipe_db", // Connect to local MongoDB database
  { useNewUrlParser: true }             // Use new URL parser
);
mongoose.connection; // Access the default connection

// === SAMPLE DATA ===
let contacts = [
  {
    name: "Jon Wexler",
    email: "jon@jonwexler.com",
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
Subscriber.deleteMany()   // Delete all documents in the subscribers collection
  .exec()                 // Execute the query
  .then(() => {
    console.log("Subscriber data is empty!"); // Confirm deletion
  });

// === CREATE NEW SUBSCRIBERS ===
let commands = []; // Array to hold promises for creating subscribers

// Loop through sample contacts and create a Subscriber for each
contacts.forEach(c => {
  commands.push(
    Subscriber.create({
      name: c.name,
      email: c.email
      // zipCode could also be added here if desired: zipCode: c.zipCode
    })
  );
});

// Execute all create operations concurrently
Promise.all(commands)
  .then(r => {
    console.log(JSON.stringify(r)); // Log all created subscribers
    mongoose.connection.close();    // Close the MongoDB connection
  })
  .catch(error => {
    console.log(`ERROR: ${error}`); // Handle any errors
  });
