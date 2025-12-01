const mongoose = require("mongoose");
const BlogPost = require("./models/BlogPost");

mongoose.connect("mongodb://localhost/my_database", { useNewUrlParser: true });

// CREATING DOCUMENT IN COLLECTION
// BLOGPOST 1
// BlogPost.create({
// title: 'The Mythbuster Guide to Saving Money on Energy Bills',
// body: `If you have been here a long time, you might remember when I
// went on ITV Tonight to dispense a masterclass in saving money on energy
// bills. Energy-saving is one of my favourite money topics, because once
// you get past the boring bullet-point lists, a whole new world of thrifty
// nerdery opens up. You know those bullet-point lists. You start spotting
// them everything at this time of year. They go like this:`
// }, (error, blogpost) => {
// console.log(error, blogpost)
// })

// BLOGPOST 2
// BlogPost.create(
//   {
//     title: "Delete This",
//     body: `To Be Deleted`,
//   },
//   (error, blogpost) => {
//     console.log(error, blogpost);
//   }
// );

// READING ALL DOCUMENTS IN BLOGPOSTS COLLECTION
BlogPost.find({}, (error, blogspot) => {
  console.log(error, blogspot);
});

// READING ALL DOCUMENTS WITH "The" IN THEIR TITLE
// BlogPost.find(
//   {
//     title: /The/,
//   },
//   (error, blogspot) => {
//     console.log(error, blogspot);
//   }
// );

// READING A DOCUMENT BY ITS TITLE
// BlogPost.find({
//     title:"The Mythbuster's Guide to Saving Money on Energy Bills"
//     }, (error, blogspot) =>{
//     console.log(error,blogspot)
//     })

// READING A DOCUMENT BY ITS ID
// var id = "6915e161cfd28a0218488b49";
// BlogPost.findById(id, (error, blogspot) => {
//   console.log(error, blogspot);
// });

// UPDATING DOCUMENT IN COLLECTION
// var id = "6915e161cfd28a0218488b49";

// BlogPost.findByIdAndUpdate(
//   id,
//   {
//     title: "Updated title",
//   },
//   (error, blogspot) => {
//     console.log(error, blogspot);
//   }
// );

// DELETING DOCUMENT FROM COLLECTION
// var id = "6915ecdb5d473332a80515b6";
// BlogPost.findByIdAndDelete(id, (error, blogspot) => {
//   console.log(error, blogspot);
// });
