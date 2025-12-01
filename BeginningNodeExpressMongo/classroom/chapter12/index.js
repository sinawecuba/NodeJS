const express = require("express");
const app = new express();
const path = require("path");
const ejs = require("ejs");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");

// Controllers
const storeUserController = require("./controllers/storeUser");
const newUserController = require("./controllers/newUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/userLogin");
const logoutController = require("./controllers/logout");
const newPostController = require("./controllers/newPost");
const homeController = require("./controllers/home");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");

// Middleware
const authMiddleware = require("./middleware/authMiddleware");
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware");

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

// Global Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(customMiddleWare);

app.use(
  expressSession({
    secret: "keyboard cat",
  })
);

// Make loggedIn available globally
global.loggedIn = null;
app.use((req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

// Routes
app.get("/", homeController);
app.get("/post/:id", getPostController);

// Auth Routes
app.get("/auth/register", redirectIfAuthenticatedMiddleware, newUserController);
app.post("/users/register", redirectIfAuthenticatedMiddleware, storeUserController);

app.get("/auth/login", redirectIfAuthenticatedMiddleware, loginController);
app.post("/users/login", redirectIfAuthenticatedMiddleware, loginUserController);

app.get("/auth/logout", logoutController);

// Post Routes (Protected)
app.get("/posts/new", authMiddleware, newPostController);
app.post("/posts/store", authMiddleware, validateMiddleWare, storePostController);

// 404 Page
app.use((req, res) => res.render("notfound"));

// Server
app.listen(4000, () => {
  console.log("App listening on port 4000");
});