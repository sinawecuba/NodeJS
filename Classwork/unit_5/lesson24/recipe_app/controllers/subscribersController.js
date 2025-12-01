"use strict"; // Enable strict mode for safer JavaScript

// Import the Subscriber Mongoose model to interact with the "subscribers" collection
const Subscriber = require("../models/subscriber");

module.exports = {
  /**
   * Fetch all subscribers from the database.
   * Stores the results in res.locals.subscribers for use in views or subsequent middleware.
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {Function} next - Pass control to the next middleware
   */
  index: (req, res, next) => {
    Subscriber.find({})
      .then(subscribers => {
        res.locals.subscribers = subscribers; // Make subscribers available to views
        next();
      })
      .catch(error => {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error); // Forward error to error-handling middleware
      });
  },

  /**
   * Render the view that lists all subscribers.
   */
  indexView: (req, res) => {
    res.render("subscribers/index"); // Render 'subscribers/index.ejs'
  },

  /**
   * Save a new subscriber from form data and render a thank-you page.
   */
  saveSubscriber: (req, res) => {
    let newSubscriber = new Subscriber({
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    });

    newSubscriber
      .save()
      .then(result => {
        res.render("thanks"); // Render 'thanks.ejs' on successful subscription
      })
      .catch(error => {
        if (error) res.send(error); // Send error if saving fails
      });
  },

  /**
   * Render the form to create a new subscriber.
   */
  new: (req, res) => {
    res.render("subscribers/new"); // Render 'subscribers/new.ejs'
  },

  /**
   * Create a new subscriber in the database.
   * Stores the subscriber and redirect path in res.locals for middleware chaining.
   */
  create: (req, res, next) => {
    let subscriberParams = {
      name: req.body.name,
      email: req.body.email,
      zipCode: req.body.zipCode
    };

    Subscriber.create(subscriberParams)
      .then(subscriber => {
        res.locals.redirect = "/subscribers"; // Redirect to subscribers list
        res.locals.subscriber = subscriber;    // Make new subscriber available for next middleware
        next();
      })
      .catch(error => {
        console.log(`Error saving subscriber: ${error.message}`);
        next(error);
      });
  },

  /**
   * Fetch a subscriber by ID.
   * Stores the result in res.locals.subscriber for use in views or next middleware.
   */
  show: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then(subscriber => {
        res.locals.subscriber = subscriber; // Make subscriber available for next middleware
        next();
      })
      .catch(error => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Render a view to show a single subscriber's details.
   */
  showView: (req, res) => {
    res.render("subscribers/show"); // Render 'subscribers/show.ejs'
  },

  /**
   * Render the form to edit a subscriber.
   * Passes the subscriber data to the view.
   */
  edit: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then(subscriber => {
        res.render("subscribers/edit", { subscriber: subscriber }); // Render edit form
      })
      .catch(error => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Update a subscriber with form data.
   * Sets the redirect path and updated subscriber in res.locals.
   */
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
        res.locals.subscriber = subscriber;                   // Store updated subscriber for next middleware
        next();
      })
      .catch(error => {
        console.log(`Error updating subscriber by ID: ${error.message}`);
        next(error);
      });
  },

  /**
   * Delete a subscriber by ID.
   * Sets redirect path in res.locals to return to subscriber list.
   */
  delete: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndRemove(subscriberId)
      .then(() => {
        res.locals.redirect = "/subscribers"; // Redirect after deletion
        next();
      })
      .catch(error => {
        console.log(`Error deleting subscriber by ID: ${error.message}`);
        next();
      });
  },

  /**
   * Middleware to handle redirects.
   * Redirects to res.locals.redirect if defined, otherwise passes control to next middleware.
   */
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath !== undefined) res.redirect(redirectPath);
    else next();
  }
};
