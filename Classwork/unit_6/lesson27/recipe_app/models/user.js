"use strict"; // Enforce strict mode to catch common mistakes

// ----------------------------
// MODULE IMPORTS
// ----------------------------
const mongoose = require("mongoose"), // Import Mongoose for MongoDB modeling
  { Schema } = mongoose, // Extract Schema constructor
  Subscriber = require("./subscriber"), // Import Subscriber model
  passportLocalMongoose = require("passport-local-mongoose"); // Plugin for handling authentication

// ----------------------------
// DEFINE USER SCHEMA
// ----------------------------
const userSchema = new Schema(
  {
    // User's name object
    name: {
      first: {
        type: String, // First name as string
        trim: true // Remove whitespace from both ends
      },
      last: {
        type: String, // Last name as string
        trim: true
      }
    },

    // User's email
    email: {
      type: String, // Data type string
      required: true, // Must provide email
      lowercase: true, // Store email in lowercase
      unique: true // Ensure unique emails
    },

    // User's zip code
    zipCode: {
      type: Number, // Numeric zip code
      min: [1000, "Zip code too short"], // Minimum valid zip
      max: 99999 // Maximum valid zip
    },

    // Array of courses the user is enrolled in
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }], 
    // Reference to Course model

    // Reference to Subscriber account (if exists)
    subscribedAccount: {
      type: Schema.Types.ObjectId, // ObjectId reference
      ref: "Subscriber" // Points to Subscriber model
    }
  },
  {
    timestamps: true // Automatically add createdAt and updatedAt fields
  }
);

// ----------------------------
// VIRTUAL PROPERTIES
// ----------------------------
// Virtual for user's full name
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`; // Combine first and last names
});

// ----------------------------
// PRE-SAVE HOOK
// ----------------------------
// Automatically link User to Subscriber account if exists
userSchema.pre("save", function(next) {
  let user = this;
  // Check if subscribedAccount is undefined
  if (user.subscribedAccount === undefined) {
    // Find Subscriber with matching email
    Subscriber.findOne({ email: user.email })
      .then(subscriber => {
        user.subscribedAccount = subscriber; // Link subscriber account
        next(); // Proceed to save user
      })
      .catch(error => {
        console.log(`Error in connecting subscriber:${error.message}`); // Log error
        next(error); // Pass error to Mongoose
      });
  } else {
    next(); // Already linked, continue saving
  }
});

// ----------------------------
// PASSPORT LOCAL MONGOOSE PLUGIN
// ----------------------------
// Automatically handles password hashing and authentication
// Adds 'hash' and 'salt' fields to schema instead of storing plain password
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email" // Use email as the login username
});

// ----------------------------
// EXPORT MODEL
// ----------------------------
module.exports = mongoose.model("User", userSchema); // Export User model for controllers
