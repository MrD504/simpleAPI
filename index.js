const http = require('http');
const url = require('url');

const port = 3000;
const server = http.createServer((req, res) => {

    // Get the url and parse it
    let parsedUrl = url.parse(req.url, true);

    // Get the path
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/|\/+$/g,'');

    // Get the HTTP method
    let method = req.method.toLowerCase();

    // Get query
    let queryStringObject = parsedUrl.query;

    // Get Headers
    let headers = req.headers;
    res.end('Hello World\n');

    console.log("Request received with these headers: %o ", headers);
});


server.listen(port, () => console.log("The server is listening on port %d", port));

