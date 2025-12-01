const express = require("express");
const app = new express();
const path = require("path");

const ejs = require("ejs");

// ==================== CHAPTER05 =======================
const BlogPost = require("./models/BlogPost.js");
// ======================================================

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_database", { useNewUrlParser: true });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());

app.listen(4000, () => {
  console.log("App listening on port 4000");
});

app.get("/", async (req, res) => {
  const blogposts = await BlogPost.find({});
  // console.log(blogposts);
  res.render("index", {
    blogposts,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/post/:id", async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id);
  res.render("post", {
    blogpost,
  });
});

app.get("/newPost", (req, res) => {
  res.render("create");
});

app.post("/posts/store", async (req, res) => {
  // model creates a new doc with browser data
  await BlogPost.create(req.body);
  res.redirect("/");
});
