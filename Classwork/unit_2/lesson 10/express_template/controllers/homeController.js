// Exported function to handle requests that include a URL parameter
exports.sendReqParam = (req, res) => {
    // Extract the 'vegetable' parameter from the request URL
    let veg = req.params.vegetable;

    // Send a response to the client displaying the vegetable name
    res.send(`This is the page for ${veg}`);
};

// Exported function to handle POST requests
exports.sendPost = (req, res) => {
    // Log any data sent in the request body (e.g., form data or JSON)
    console.log(req.body);

    // Log any query string parameters included in the request URL
    console.log(req.query);

    // Send a confirmation response back to the client
    res.send("POST Successful!");
};

// Exported function to render a view and pass a name parameter to it
exports.respondWithName = (req, res) => {
    // Render the 'index' view and pass the 'myName' parameter as 'firstName'
    // Example URL: /users/John will render the page with firstName = "John"
    res.render("index", { firstName: req.params.myName });
};
