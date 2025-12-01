"use strict"; // Enforces strict mode to prevent unsafe JavaScript practices

const mongoose = require("mongoose"); // Import Mongoose library to interact with MongoDB
const Subscriber = require("./models/subscriber"); // Import the Subscriber model
const Course = require("./models/course"); // Import the Course model

// Connect to the MongoDB database named "recipe_db"
mongoose.connect("mongodb://localhost:27017/recipe_db", {
    useNewUrlParser: true, // Use the new MongoDB connection string parser
    useUnifiedTopology: true // Use the new server discovery and monitoring engine
});

// Set Mongoose to use native ES6 Promises
mongoose.Promise = global.Promise;

// Run code only once the database connection is successfully opened
mongoose.connection.once("open", async () => {
    console.log("\n✅ Connected to MongoDB");

    try {
        // Clear existing data from both collections (for a clean start)
        await Subscriber.deleteMany({});
        await Course.deleteMany({});

        // Create a new Course document in the database
        const course = await Course.create({
            title: "Intro to Samosas",
            description: "Learn how to make the perfect samosas!",
            items: ["Flour", "Spices", "Potatoes"], // Example course materials
            zipCode: 12345
        });
        console.log("\n📘 Course created:", course.title);

        // Create a new Subscriber document
        const subscriber = await Subscriber.create({
            name: "James oliveira",
            email: "oliveira1james@gmail.com",
            zipCode: 12345
        });
        console.log("\n👤 Subscriber created:", subscriber.getInfo());

        // Link the course to the subscriber by pushing the course ID into the subscriber's 'courses' array
        subscriber.courses.push(course._id);

        // Save the updated subscriber document with the linked course
        await subscriber.save();

        // Retrieve the subscriber and replace course IDs with full course data using .populate()
        const populatedSub = await Subscriber.findOne({ email: "oliveira1james@gmail.com" })
            .populate("courses") // Populates course details instead of just ObjectId
            .exec();

        // Display the subscriber with all populated course information
        console.log("\n=== Subscriber with Populated Courses ===");
        console.log(populatedSub);

    } catch (err) {
        // Catch and log any errors that occur during the database operations
        console.error("\n❌ Error:", err.message);
    } finally {
        // Close the database connection once all operations are done
        mongoose.connection.close();
        console.log("\n🔒 MongoDB connection closed");
    }
});
