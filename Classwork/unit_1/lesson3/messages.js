"use strict";  
// Enables strict mode — helps catch common coding mistakes 
// (like using undeclared variables or reserved words)

exports.messages = [
    "Push past your limits",
    "Dont be a fool",
    "Captain Yami was here"
];
// Defines an array of messages and exports it from this module
// This allows other files to import and use 'messages' using `require()`

// Example usage in another file:
// const myModule = require('./thisFileName');
// console.log(myModule.messages);