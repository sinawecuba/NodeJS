"use strict";

const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");

// === Connect to MongoDB ===
mongoose.connect(
  "mongodb://0.0.0.0:27017/recipe_db",
  { useNewUrlParser: true } // Use the new URL parser
);
mongoose.connection; // Access the connection (optional)

// === Array of test subscriber contacts ===
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

// === Clear existing subscribers from the database ===
Subscriber.deleteMany()
  .exec()
  .then(() => {
    console.log("Subscriber data is empty!");
  });

// === Array to store creation promises ===
let commands = [];

// === Loop through contacts and create subscribers ===
contacts.forEach(c => {
  commands.push(
    Subscriber.create({
      name: c.name,
      email: c.email
    })
  );
});

// === Execute all create operations in parallel ===
Promise.all(commands)
  .then(r => {
    // Log the newly created subscribers
    console.log(JSON.stringify(r));
    // Close the database connection
    mongoose.connection.close();
  })
  .catch(error => {
    // Handle any errors that occur
    console.log(`ERROR: ${error}`);
  });
