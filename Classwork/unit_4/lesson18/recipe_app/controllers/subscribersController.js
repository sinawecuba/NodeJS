"use strict"; // Enforces strict mode to catch common coding mistakes and ensure cleaner code execution

const Subscriber = require("../models/subscriber"); // Import the Subscriber model to interact with the "subscribers" collection in MongoDB

// Export an object containing controller methods for managing subscribers
module.exports = {

  // === CONTROLLER METHOD: index ===
  // Purpose: Retrieve all subscribers from the database and pass them to the next middleware
  index: (req, res, next) => {
    Subscriber.find({}) // Fetch all subscriber documents from the collection
      .then(subscribers => {
        // Store the list of subscribers in res.locals (temporary storage)
        // so it can be accessed by the next middleware or the view
        res.locals.subscribers = subscribers;
        next(); // Move on to the next middleware function (e.g., indexView)
      })
      .catch(error => {
        // Log any error that occurs during database retrieval
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error); // Pass the error to Express's error-handling middleware
      });
  },

  // === CONTROLLER METHOD: indexView ===
  // Purpose: Render the "subscribers/index" view to display all subscribers
  indexView: (req, res) => {
    res.render("subscribers/index"); // Render the template for listing subscribers
  },

  // === CONTROLLER METHOD: saveSubscriber ===
  // Purpose: Save a new subscriber’s information to the database
  saveSubscriber: (req, res) => {
    // Create a new Subscriber object using data sent from the client (via a form)
    let newSubscriber = new Subscriber({
      name: req.body.name,     // Subscriber's name from the form input
      email: req.body.email,   // Subscriber's email from the form input
      zipCode: req.body.zipCode // Subscriber's zip code from the form input
    });

    // Save the new subscriber to the database
    newSubscriber
      .save()
      .then(result => {
        // If successful, render a "thanks" page to confirm subscription
        res.render("thanks");
      })
      .catch(error => {
        // If an error occurs (e.g., validation error), send it back in the response
        if (error) res.send(error);
      });
  }
};
