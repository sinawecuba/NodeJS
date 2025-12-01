// Function to handle requests with a URL parameter
exports.sendReqParam = (req, res) => {
    let veg = req.params.vegetable; // Extract the 'vegetable' parameter from the URL
    res.send(`This is the page for ${veg}`); // Send a response displaying the vegetable
};

// Function to handle POST requests
exports.sendPost = (req, res) => {
    console.log(req.body); // Log the data sent in the body of the POST request
    console.log(req.query); // Log any query string parameters sent in the request
    res.send("POST Successful!"); // Send a confirmation response
};

// Function to render a template with a dynamic name
exports.respondWithName = (req, res) => {
    // Example: render the "index" template with a variable 'firstName' from the URL parameter 'myName'
    res.render("index", { firstName: req.params.myName }); 
};
