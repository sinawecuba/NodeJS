"use strict";  
// Enables strict mode — helps catch common coding mistakes 
// (like using undeclared variables or reserved words)

const messageModule = require("./messages");  
// Imports the exported contents from the 'messages.js' file
// In this case, it imports the 'messages' array

messageModule.messages.forEach(m => console.log(m));  
// Loops through each message in the 'messages' array using forEach()
// For each message 'm', it prints the message to the console

// Expected output:
// Push past your limits
// Dont be a fool
// Captain Yami was here