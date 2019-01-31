const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");

/* Instantiating the HTTP server */
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

/* Certificate configuration for HTTPS server */
const httpsServerOptions = {
  key: fs.readFileSync("https/key.pem"),
  cert: fs.readFileSync("https/cert.pem")
};

/* Instantiating the HTTPS server */
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

/* Starting the HTTP server */
httpServer.listen(config.httpPort, () => {
  console.log("The server is listening on port %d", config.httpPort);
});

/* Starting the HTTPS server */
httpsServer.listen(config.httpsPort, () => {
  console.log("The server is listening on port %d", config.httpsPort);
});

const unifiedServer = (req, res) => {
  /* Get the url and parse it */
  let parsedUrl = url.parse(req.url, true);

  /* Get the path */
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/|\/+$/g, "");

  /* Get the HTTP method */
  let method = req.method.toLowerCase();

  /* Get query */
  let queryStringObject = parsedUrl.query;

  /* Get Headers */
  let headers = req.headers;

  /* Get the payload if there is any */
  let decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", data => (buffer += decoder.write(data)));

  req.on("end", () => (buffer += decoder.end()));

  let chosenHandler =
    typeof router[trimmedPath] !== "undefined"
      ? router[trimmedPath]
      : handlers.notFound;

  /* Construct the data object to send to the handler */
  let data = {
    trimmedPath: trimmedPath,
    queryStringObject: queryStringObject,
    method: method,
    headers: headers,
    payload: buffer
  };

  /* Route the request to the handler specified in the handler */
  chosenHandler(data, (statusCode, payload) => {
    /* use the status code called back by the handler, or default to 200 */
    statusCode = typeof statusCode === "number" ? statusCode : 200;

    /* use the payload called back by the hanlder, or default to empty object */
    payload = typeof payload === "object" ? payload : {};

    /* Convert the payload to a string */
    var payloadString = JSON.stringify(payload);

    /* Return the response */
    res.setHeader("Content-Type", "application/json");
    res.writeHead(statusCode);
    res.end(payloadString);

    /* Log the request path */
    console.log("Returning with this response: ", statusCode, payloadString);
  });
};
/* Define the handlers */
let handlers = {};

/* Define a request router */
/* Callback a http status code, and a payload object */

handlers.sample = (data, callback) =>
  callback(406, { name: "handlers.sample" });

/* Not found handler */
handlers.notFound = (data, callback) => callback(404);

let router = {
  sample: handlers.sample
};
