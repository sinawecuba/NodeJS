// Import Express framework to create the web application
const express = require("express");
const app = new express(); // Initialize a new Express application

// Import utilities
const path = require("path"); // For handling file and directory paths
const ejs = require("ejs"); // Template engine for rendering HTML
const fileUpload = require("express-fileupload"); // Middleware to handle file uploads
const expressSession = require("express-session"); // Middleware for session handling
const connectFlash = require("connect-flash"); // Middleware for flash messages (e.g., validation errors)

// Import Controllers (functions that handle requests for each route)
const storeUserController = require("./controllers/storeUser");
const newUserController = require("./controllers/newUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/userLogin");
const logoutController = require("./controllers/logout");
const newPostController = require("./controllers/newPost");
const homeController = require("./controllers/home");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const aboutController = require('./controllers/about');
const contactController = require('./controllers/contact');

// Import custom middleware
const authMiddleware = require("./middleware/authMiddleware"); // Protect routes for authenticated users
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware"); // Redirect logged-in users away from login/register

// Custom middleware example: logs a message for every request
const customMiddleWare = (req, res, next) => {
  console.log("Custom middle ware called");
  next(); // Continue to the next middleware/route handler
};

// Middleware to validate post creation form (ensures a file and title exist)
const validateMiddleWare = (req, res, next) => {
  if (req.files == null || req.body.title == null) {
    return res.redirect("/posts/new"); // Redirect if validation fails
  }
  next(); // Continue if validation passes
};

// Connect to MongoDB using Mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set EJS as the view/template engine
app.set("view engine", "ejs");
// Specify where the views (templates) are stored
app.set("views", path.join(__dirname, "public", "views"));

// Global middleware

// Serve static files (CSS, JS, images, etc.) from the "public" directory
app.use(express.static("public"));

// Parse URL-encoded data from form submissions
app.use(express.urlencoded({ extended: false }));

// Handle file uploads
app.use(fileUpload());

// Apply custom logging middleware
app.use(customMiddleWare);

// Set up session handling
app.use(
  expressSession({
    secret: "keyboard cat", // Secret key to sign session ID cookies
  })
);

// Enable flash messages (requires sessions)
app.use(connectFlash()); // Must come after expressSession

// Make the logged-in user globally accessible in templates
global.loggedIn = null;
app.use((req, res, next) => {
  loggedIn = req.session.userId; // Store session user ID in global variable
  next();
});

// Routes

// Home page
app.get("/", homeController);

// Single post page
app.get("/post/:id", getPostController);

// About and Contact pages
app.get('/about', aboutController);
app.get('/contact', contactController);

// Authentication Routes

// Show registration page (redirect if already logged in)
app.get("/auth/register", redirectIfAuthenticatedMiddleware, newUserController);
// Handle registration form submission
app.post("/users/register", redirectIfAuthenticatedMiddleware, storeUserController);

// Show login page (redirect if already logged in)
app.get("/auth/login", redirectIfAuthenticatedMiddleware, loginController);
// Handle login form submission
app.post("/users/login", redirectIfAuthenticatedMiddleware, loginUserController);

// Logout route
app.get("/auth/logout", logoutController);

// Post Routes (require authentication)

// Show new post form
app.get("/posts/new", authMiddleware, newPostController);
// Handle new post submission, with validation middleware
app.post("/posts/store", authMiddleware, validateMiddleWare, storePostController);

// 404 Page - catch all undefined routes
app.use((req, res) => res.render("notfound"));

// Start the server and listen on port 4000
app.listen(4000, () => {
  console.log("App listening on port 4000");
});
