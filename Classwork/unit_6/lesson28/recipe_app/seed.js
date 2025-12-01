"use strict"; // Enforce strict mode

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const mongoose = require("mongoose"), // MongoDB ODM
  Subscriber = require("./models/subscriber"), // Subscriber model
  User = require("./models/user"), // User model
  Course = require("./models/course"); // Course model (not used in this snippet)

// ----------------------------
// DATABASE CONNECTION
// ----------------------------
mongoose.connect("mongodb://localhost/recipe_db"); // Connect to local MongoDB
mongoose.connection; // Access connection object (not used further)

// ----------------------------
// TEST USERS ARRAY
// ----------------------------
var users = [
  {
    name: { first: "Jon", last: "Wexler" },
    email: "jon@jonwexler.com",
    zipCode: 10016,
    password: "12345"
  },
  {
    name: { first: "Chef", last: "Eggplant" },
    email: "eggplant@recipeapp.com",
    zipCode: 20331,
    password: "12345"
  },
  {
    name: { first: "Professor", last: "Souffle" },
    email: "souffle@recipeapp.com",
    zipCode: 19103,
    password: "12345"
  }
];

// ----------------------------
// FUNCTION TO CREATE SUBSCRIBER
// ----------------------------
let createSubscriber = (c, resolve) => {
  Subscriber.create({
    name: `${c.name.first} ${c.name.last}`, // Combine first + last for subscriber name
    email: c.email,
    zipCode: c.zipCode
  }).then(sub => {
    console.log(`CREATED SUBSCRIBER: ${sub.name}`); // Log created subscriber
    resolve(sub); // Resolve promise for chaining
  });
};

// ----------------------------
// CHAIN PROMISES TO CLEAR & CREATE SUBSCRIBERS
// ----------------------------
users.reduce(
  (promiseChain, next) => {
    return promiseChain.then(
      () =>
        new Promise(resolve => {
          createSubscriber(next, resolve); // Create subscriber sequentially
        })
    );
  },
  Subscriber.remove({}) // Remove all existing subscribers first
    .exec()
    .then(() => {
      console.log("Subscriber data is empty!"); // Confirm removal
    })
);

// ----------------------------
// FUNCTION TO REGISTER USERS
// ----------------------------
let registerUser = (u, resolve) => {
  User.register(
    {
      name: { first: u.name.first, last: u.name.last }, // User name object
      email: u.email,
      zipCode: u.zipCode,
      password: u.password // Not stored directly; handled by passport-local-mongoose
    },
    u.password, // Password passed to hash
    (error, user) => {
      console.log(`USER created: ${user.fullName}`); // Log created user
      resolve(user); // Resolve promise for chaining
    }
  );
};

// ----------------------------
// CHAIN PROMISES TO CLEAR & REGISTER USERS
// ----------------------------
users
  .reduce(
    (promiseChain, next) => {
      return promiseChain.then(
        () =>
          new Promise(resolve => {
            registerUser(next, resolve); // Register user sequentially
          })
      );
    },
    User.remove({}) // Remove all existing users first
      .exec()
      .then(() => {
        console.log("User data is empty!"); // Confirm removal
      })
  )
  .then(r => {
    console.log(JSON.stringify(r)); // Log final result
    mongoose.connection.close(); // Close DB connection
  })
  .catch(error => {
    console.log(`ERROR: ${error}`); // Log any errors during seeding
  });