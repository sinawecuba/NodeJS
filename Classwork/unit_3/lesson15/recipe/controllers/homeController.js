"use strict"; // Enforces strict mode for safer, cleaner JavaScript

// === Controller for Homepage ===
// Renders the "index.ejs" view when the root URL ("/") is requested.
exports.showHome = (req, res) => {
    res.render("index"); // Render the homepage view (views/index.ejs)
};

// === Controller for Courses Page ===
// Renders the "courses.ejs" view and passes an array of courses to display.
exports.showCourses = (req, res) => {
    res.render("courses", {
        offeredCourses: [                     // Data passed to the EJS template
            "Italian Cooking",
            "Vegetarian Dishes",
            "Baking Basics",
            "Sushi for Beginners"
        ]
    });
};
