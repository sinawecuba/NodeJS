"use strict";

// =======================================
// Import Subscriber model
// =======================================
const Subscriber = require("../models/subscriber");

module.exports = {

  // =======================================
  // Fetch all subscribers from the database
  // Stores them in res.locals.subscribers for downstream middleware
  // =======================================
  index: (req, res, next) => {
    Subscriber.find({})
      .then(subscribers => {
        res.locals.subscribers = subscribers;
        next(); // Proceed to next middleware
      })
      .catch(error => {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error); // Pass error to error handling middleware
      });
  },

  // =======================================
  // Render view for listing all subscribers
  // =======================================
  indexView: (req, res) => {
    res.render("subscribers/index"); // Render "subscribers/index.ejs"
  },

  // =======================================
  // Handle POST request to save a new subscriber
  // =======================================
  saveSubscriber: (req, res) => {
    console.log("Received POST request for subscribe:", req.body);

    let newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    });

    newSubscriber
      .save() // Save the subscriber to MongoDB
      .then(result => {
        res.render("thanks"); // Render thank-you page after success
      })
      .catch(error => {
        if (error) res.send(error); // Send error if saving fails
      });
  },

  // =======================================
  // Render form to create a new subscriber
  // =======================================
  new: (req, res) => {
    res.render("subscribers/new"); // Render "subscribers/new.ejs"
  },

  // =======================================
  // Create a new subscriber using middleware pattern
  // Stores subscriber in res.locals for redirection
  // =======================================
  create: (req, res, next) => {
    let subscriberParams = {
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    };

    Subscriber.create(subscriberParams)
      .then(subscriber => {
        res.locals.redirect = "/subscribers"; // Redirect after creation
        res.locals.subscriber = subscriber;    // Store created subscriber
        next(); // Proceed to redirect middleware
      })
      .catch(error => {
        console.log(`Error saving subscriber: ${error.message}`);
        next(error); // Pass error to error handling middleware
      });
  },

  // =======================================
  // Fetch a single subscriber by ID
  // Stores subscriber in res.locals.subscriber for downstream use
  // =======================================
  show: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then(subscriber => {
        res.locals.subscriber = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  // =======================================
  // Render view for showing a single subscriber
  // =======================================
  showView: (req, res) => {
    res.render("subscribers/show"); // Render "subscribers/show.ejs"
  },

  // =======================================
  // Render form to edit a subscriber
  // =======================================
  edit: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then(subscriber => {
        res.render("subscribers/edit", { subscriber: subscriber }); // Pass subscriber to template
      })
      .catch(error => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  // =======================================
  // Update subscriber data in the database
  // =======================================
  update: (req, res, next) => {
    let subscriberId = req.params.id,
        subscriberParams = {
          name: req.body.name,
          email: req.body.email,
          zipCode: req.body.zipCode
        };

    Subscriber.findByIdAndUpdate(subscriberId, { $set: subscriberParams })
      .then(subscriber => {
        res.locals.redirect = `/subscribers/${subscriberId}`; // Redirect to updated subscriber
        res.locals.subscriber = subscriber;
        next(); // Proceed to redirect middleware
      })
      .catch(error => {
        console.log(`Error updating subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  // =======================================
  // Delete a subscriber from the database
  // =======================================
  delete: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndRemove(subscriberId)
      .then(() => {
        res.locals.redirect = "/subscribers"; // Redirect to subscriber list after deletion
        next();
      })
      .catch(error => {
        console.log(`Error deleting subscriber by ID: ${error.message}`);
        next();
      });
  },

  // =======================================
  // Middleware to handle redirection after operations
  // =======================================
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  }
};
