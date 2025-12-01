"use strict"; // Enforce strict mode for safer and cleaner JavaScript

// === IMPORT MONGOOSE AND EXTRACT SCHEMA ===
const mongoose = require("mongoose"),
  { Schema } = mongoose; // Extract Schema constructor for defining schemas

// === DEFINE USER SCHEMA ===
// This schema defines the structure of documents in the "users" collection
const userSchema = new Schema(
  {
    // User's full name stored as an object
    name: {
      first: {
        type: String,  // First name must be a string
        trim: true     // Remove leading/trailing whitespace
      },
      last: {
        type: String,  // Last name must be a string
        trim: true
      }
    },

    // User's email address
    email: {
      type: String,    // Must be a string
      required: true,  // Mandatory field
      lowercase: true, // Convert email to lowercase before saving
      unique: true     // Ensure no duplicate emails
    },

    // User's zip code
    zipCode: {
      type: Number,                  // Must be a number
      min: [1000, "Zip code too short"], // Minimum value validation
      max: 99999                       // Maximum value validation
    },

    // User's password
    password: {
      type: String,   // Must be a string
      required: true  // Mandatory field
    },

    // Courses associated with the user
    courses: [
      { type: Schema.Types.ObjectId, ref: "Course" } // References "Course" documents
    ],

    // Subscriber account linked to the user
    subscribedAccount: {
      type: Schema.Types.ObjectId, // Store ObjectId
      ref: "Subscriber"           // Reference the "Subscriber" model
    }
  },
  {
    timestamps: true // Automatically add `createdAt` and `updatedAt` fields
  }
);

// === VIRTUAL PROPERTY: fullName ===
// Concatenates first and last names into a single string
userSchema.virtual("fullName").get(function() {
  return `${this.name.first} ${this.name.last}`;
});

// === EXPORT USER MODEL ===
// Creates a Mongoose model named "User" based on userSchema
// Allows interaction with the "users" collection in MongoDB
module.exports = mongoose.model("User", userSchema);
