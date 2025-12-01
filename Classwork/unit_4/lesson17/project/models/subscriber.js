"use strict"; // Enables strict mode to catch common coding mistakes and unsafe operations

const mongoose = require("mongoose"); // Import Mongoose library for working with MongoDB
const { Schema } = mongoose; // Extract Schema class from mongoose for easier reference

// Define a schema for the "Subscriber" collection
const subscriberSchema = new Schema(
    {
        // Subscriber's full name
        name: {
            type: String, // Data type: String
            required: [true, "Name is required"], // Validation: must be provided
            trim: true // Automatically remove spaces before and after the name
        },

        // Subscriber's email address
        email: {
            type: String, // Data type: String
            required: [true, "Email is required"], // Validation: must be provided
            lowercase: true, // Automatically convert email to lowercase before saving
            unique: true, // Ensure each email is unique (no duplicates)
            match: [/.+@.+\..+/, "Please enter a valid email address"] // Validate email format using regex
        },

        // Subscriber's postal/zip code
        zipCode: {
            type: Number, // Data type: Number
            required: [true, "Zip Code required"], // Validation: must be provided
            min: [10000, "Zip Code too short"], // Minimum allowed zip code
            max: [99999, "Zip Code too long"] // Maximum allowed zip code
        },

        // References to courses that the subscriber is enrolled in
        // Stores ObjectIds that reference documents from the "Course" collection
        courses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
    },
    {
        // Automatically create createdAt and updatedAt timestamps
        timestamps: true
    }
);

// Instance method — can be called on a specific subscriber object
// Returns formatted info about the subscriber
subscriberSchema.methods.getInfo = function () {
    return `Name: ${this.name} | Email: ${this.email} | Zip Code: ${this.zipCode}`;
};

// Static method — can be called directly on the model itself
// Finds all subscribers with a given zip code
subscriberSchema.statics.findByZip = function (zip) {
    return this.find({ zipCode: zip });
};

// Export the Subscriber model based on the defined schema
module.exports = mongoose.model("Subscriber", subscriberSchema);
