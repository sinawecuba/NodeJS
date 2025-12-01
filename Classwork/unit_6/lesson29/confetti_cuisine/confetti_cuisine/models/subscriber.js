"use strict"; // Enables strict mode to catch common coding errors and enforce cleaner code

const mongoose = require("mongoose"); // Imports Mongoose library for MongoDB interaction
const { Schema } = mongoose; // Extracts Schema constructor from Mongoose for creating data schemas

// Define the schema for the "Subscriber" collection
const subscriberSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true // Name field is required
    },
    email: { 
      type: String, 
      required: true, // Email is mandatory
      lowercase: true, // Automatically converts email to lowercase
      unique: true // Ensures each email is unique in the database
    },
    zipCode: { 
      type: Number, 
      min: [10000, "Too short"], // Minimum value for zip code (5 digits)
      max: 99999 // Maximum value for zip code (5 digits)
    },
    courses: [
      { 
        type: Schema.Types.ObjectId, // References another document by its ObjectId
        ref: "Course" // Refers to the "Course" model (relationship between Subscriber and Course)
      }
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Exports the model to be used elsewhere in the application
module.exports = mongoose.model("Subscriber", subscriberSchema);
