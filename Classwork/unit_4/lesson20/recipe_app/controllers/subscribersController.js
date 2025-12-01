"use strict"; // Enforce strict mode for safer and cleaner JavaScript

const Subscriber = require("../models/subscriber"); // Import Subscriber model

module.exports = {
  // Middleware to fetch all subscribers from the database
  index: (req, res, next) => {
    Subscriber.find({}) // Query all Subscriber documents
      .then(subscribers => {
        res.locals.subscribers = subscribers; // Store subscribers in res.locals for use in views
        next(); // Call next middleware/controller
      })
      .catch(error => {
        console.log(`Error fetching subscribers: ${error.message}`); // Log any errors
        next(error); // Pass error to error-handling middleware
      });
  },

  // Render the index view for subscribers
  indexView: (req, res) => {
    res.render("subscribers/index"); // Render "subscribers/index.ejs" template
  },

  // Save a new subscriber from form data
  saveSubscriber: (req, res) => {
    // Create a new Subscriber instance using request body data
    let newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    });

    // Save the subscriber to the database
    newSubscriber
      .save()
      .then(result => {
        res.render("thanks"); // Render a thank-you page on success
      })
      .catch(error => {
        if (error) res.send(error); // Send error response if saving fails
      });
  }
};
