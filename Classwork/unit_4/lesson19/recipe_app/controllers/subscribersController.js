"use strict"; // Enforce strict mode for safer and cleaner JavaScript

// === IMPORT SUBSCRIBER MODEL ===
// The Subscriber model is used to interact with the "subscribers" collection in MongoDB
const Subscriber = require("../models/subscriber");

// === EXPORT CONTROLLER METHODS ===
module.exports = {

  // === INDEX ACTION (FETCH ALL SUBSCRIBERS) ===
  // Middleware that fetches all subscribers from the database
  index: (req, res, next) => {
    Subscriber.find({}) // Retrieve all subscriber documents
      .then(subscribers => {
        // Store the retrieved subscribers in res.locals
        // This makes them accessible to the next middleware or view
        res.locals.subscribers = subscribers;

        // Pass control to the next middleware (usually indexView)
        next();
      })
      .catch(error => {
        // Log any errors that occur during the database query
        console.log(`Error fetching subscribers: ${error.message}`);

        // Pass the error to Express's error-handling middleware
        next(error);
      });
  },

  // === INDEX VIEW ACTION (RENDER SUBSCRIBER LIST) ===
  // Renders the "subscribers/index" EJS template to display the list of subscribers
  indexView: (req, res) => {
    res.render("subscribers/index"); // Render the view
  },

  // === SAVE SUBSCRIBER ACTION (CREATE NEW SUBSCRIBER) ===
  // Handles POST requests to add a new subscriber to the database
  saveSubscriber: (req, res) => {
    // Create a new Subscriber object using data from the request body
    let newSubscriber = new Subscriber({
      name: req.body.name,       // Subscriber's name from form input
      email: req.body.email,     // Subscriber's email from form input
      zipCode: req.body.zipCode  // Subscriber's zip code from form input
    });

    // Save the new subscriber to the database
    newSubscriber
      .save()
      .then(result => {
        // If save is successful, render a "thanks" page
        res.render("thanks");
      })
      .catch(error => {
        // If there is an error, send it as the response
        if (error) res.send(error);
      });
  }
};
