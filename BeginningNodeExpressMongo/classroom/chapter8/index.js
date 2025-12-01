const express = require("express");
const app = new express();
const path = require("path");
const ejs = require("ejs");
const fileUpload = require('express-fileupload');


const customMiddleWare = (req,res,next)=>{
 console.log('Custom middle ware called')
 next()
}
const validateMiddleWare = (req,res,next)=>{
 if(req.files == null || req.body.title == null){
 return res.redirect('/posts/new')
 }
 next()
}
// MongoDB
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Model
const BlogPost = require("./models/BlogPost");

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false })); // <-- important for reading form
app.use(fileUpload());

app.use(customMiddleWare)
app.use('/posts/store',validateMiddleWare)

// ROUTES

// Homepage - List Posts
app.get('/', async (req, res) => {
  const blogposts = await BlogPost.find({})
  res.render('index', {
    blogposts: blogposts
  });
})

// Show Create Page
app.get("/newPost", (req, res) => {
  res.render("create");
});

// Save Post
app.post("/posts/store", (req, res) => {
  console.log("req.files:", req.files); // Check if files are received
  console.log("req.body:", req.body); // Check form data

  let image = req.files.image;
  console.log("Image name:", image.name); // Check image details
  image.mv(
    path.resolve(__dirname, "public/assets/img", image.name),
    async (error) => {
      if (error) {
        console.error("Error moving file:", error); // ADD THIS
        return res.status(500).send(error);
      }
      console.log(
        "Image saved successfully to:",
        path.resolve(__dirname, "public/assets/img", image.name)
      ); // ADD THIS
      await BlogPost.create({
        ...req.body,
        image: "/assets/img/" + image.name,
      });
      res.redirect("/");
    }
  );
});
// Server
app.listen(4000, () => {
  console.log("App listening on port 4000");
});
