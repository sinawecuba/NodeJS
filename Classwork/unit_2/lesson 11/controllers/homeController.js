// Exported function to handle GET requests with a URL parameter
exports.sendReqParam = (req, res) => {
    // Extract the 'vegetable' parameter from the request URL
    // Example: if the URL is /items/carrot → req.params.vegetable = "carrot"
    let veg = req.params.vegetable;

    // Send a response back to the client displaying the vegetable name
    res.send(`This is the page for ${veg}`);
};

// Exported function to handle POST requests
exports.sendPost = (req, res) => {
    // Log the request body data to the console
    // (Data sent from an HTML form or API client in the POST request)
    console.log(req.body);

    // Log any query parameters included in the request URL
    // Example: /?id=5&name=John → req.query = { id: '5', name: 'John' }
    console.log(req.query);

    // Send a success message back to the client
    res.send("POST Successful!");
};

// Exported function to handle requests that include a name parameter
exports.respondWithName = (req, res) => {
    // Render the 'index.ejs' view and pass the 'myName' parameter as 'firstName'
    // Example: if the URL is /name/James → firstName = "James"
    res.render("index", { firstName: req.params.myName });
};
