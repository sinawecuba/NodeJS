"use strict";

const mongoose = require("mongoose"),
  { Schema } = mongoose,             // Destructure Schema from mongoose
  Subscriber = require("./subscriber"), // Import Subscriber model
  passportLocalMongoose = require("passport-local-mongoose"); // For password hashing and authentication

// =======================================
// Define the User schema
// =======================================
const userSchema = new Schema(
  {
    // User's name object with first and last names
    name: {
      first: {
        type: String,
        trim: true // Removes whitespace from both ends
      },
      last: {
        type: String,
        trim: true
      }
    },

    // User's email address
    email: {
      type: String,
      required: true,   // Email is required
      lowercase: true,  // Store email in lowercase
      unique: true      // Must be unique
    },

    // User's zip code
    zipCode: {
      type: Number,
      min: [1000, "Zip code too short"], // Minimum 4 digits
      max: 99999                         // Maximum 5 digits
    },

    // Courses the user is enrolled in (reference to Course model)
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],

    // Linked subscriber account (reference to Subscriber model)
    subscribedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber"
    }
  },
  {
    timestamps: true // Automatically add createdAt and updatedAt fields
  }
);

// =======================================
// Virtual properties
// =======================================

// Full name virtual property for convenience
userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

// =======================================
// Middleware
// =======================================

// Before saving user, link to corresponding Subscriber by email if not already linked
userSchema.pre("save", function (next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({ email: user.email })
      .then(subscriber => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

// =======================================
// Passport.js plugin
// =======================================

// Adds username/password functionality with hashing and salting
// `usernameField: "email"` tells Passport to use email instead of username
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

// =======================================
// Export User model
// =======================================
module.exports = mongoose.model("User", userSchema);
