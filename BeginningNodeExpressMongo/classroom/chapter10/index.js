const express = require("express");
const app = new express();
const path = require("path");
const ejs = require("ejs");
const fileUpload = require("express-fileupload");
const storeUserController = require('./controllers/storeUser')

// Controllers
const newPostController = require("./controllers/newPost");
const homeController = require("./controllers/home");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");

// Middleware
const customMiddleWare = (req, res, next) => {
  console.log("Custom middle ware called");
  next();
};

const validateMiddleWare = (req, res, next) => {
  if (req.files == null || req.body.title == null) {
    return res.redirect("/posts/new");
  }
  next();
};

// MongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(customMiddleWare);

// Validation middleware only for /posts/store
app.use("/posts/store", validateMiddleWare);

// ROUTES
app.get("/", homeController);                  // Home page
app.get('/newPost', newPostController);
// Create form
app.get("/post/:id", getPostController);       // Single post page
app.post("/posts/store", storePostController); // Save post
app.post('/users/register', storeUserController)



// Server
app.listen(4000, () => {
  console.log("App listening on port 4000");
});
