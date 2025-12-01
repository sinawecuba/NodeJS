"use strict"; // Enforce strict mode to catch errors

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const Subscriber = require("../models/subscriber"); // Mongoose model for Subscriber collection

// ----------------------------
// CONTROLLER METHODS
// ----------------------------
module.exports = {
  // GET /subscribers - fetch all subscribers from DB
  index: (req, res, next) => {
    Subscriber.find({}) // Find all subscriber documents
      .then(subscribers => {
        res.locals.subscribers = subscribers; // Store in locals for downstream middleware
        next(); // Pass control to next middleware
      })
      .catch(error => {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error); // Pass errors to error-handling middleware
      });
  },

  // Render the subscribers index view
  indexView: (req, res) => {
    res.render("subscribers/index"); // Render EJS view to list subscribers
  },

  // Handle POST /subscribe - save subscriber from form submission
  saveSubscriber: (req, res) => {
    console.log("Received POST request for subscribe:", req.body); // Log incoming data
    let newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    });

    newSubscriber
      .save() // Save new subscriber to DB
      .then(result => {
        res.render("thanks"); // Render thank-you page after successful save
      })
      .catch(error => {
        if (error) res.send(error); // Send error response if save fails
      });
  },

  // Render form to create a new subscriber manually
  new: (req, res) => {
    res.render("subscribers/new"); // Render new subscriber form
  },

  // POST /subscribers - create subscriber (used in RESTful flow)
  create: (req, res, next) => {
    let subscriberParams = {
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    };

    Subscriber.create(subscriberParams) // Save new subscriber to DB
      .then(subscriber => {
        res.locals.redirect = "/subscribers"; // Redirect to subscribers list after creation
        res.locals.subscriber = subscriber; // Store subscriber in locals
        next(); // Call redirect middleware
      })
      .catch(error => {
        console.log(`Error saving subscriber: ${error.message}`);
        next(error); // Pass error to middleware
      });
  },

  // GET /subscribers/:id - fetch a single subscriber by ID
  show: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then(subscriber => {
        res.locals.subscriber = subscriber; // Store subscriber in locals
        next();
      })
      .catch(error => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  // Render single subscriber view
  showView: (req, res) => {
    res.render("subscribers/show"); // Render EJS view to display one subscriber
  },

  // Render subscriber edit form
  edit: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then(subscriber => {
        res.render("subscribers/edit", { subscriber: subscriber }); // Pass subscriber to edit form
      })
      .catch(error => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  // PUT /subscribers/:id - update subscriber details
  update: (req, res, next) => {
    let subscriberId = req.params.id,
      subscriberParams = {
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
      };

    Subscriber.findByIdAndUpdate(subscriberId, { $set: subscriberParams })
      .then(subscriber => {
        res.locals.redirect = `/subscribers/${subscriberId}`; // Redirect to updated subscriber page
        res.locals.subscriber = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error updating subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  // DELETE /subscribers/:id - remove a subscriber
  delete: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndRemove(subscriberId)
      .then(() => {
        res.locals.redirect = "/subscribers"; // Redirect to subscribers list after deletion
        next();
      })
      .catch(error => {
        console.log(`Error deleting subscriber by ID: ${error.message}`);
        next(); // Continue even if deletion fails
      });
  },

  // Middleware to handle redirects
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath); // Redirect if path exists
    else next(); // Otherwise, continue
  }
};
