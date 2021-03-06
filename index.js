const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const data = require("./lib/data");

/* temporary test */
// data.create("test", "newfile", { foo: "bar" }, err => {
//   console.error(err);
// });
data.update("test", "newfile", { bar: "foo" }, err => {
  console.log(err);
});

data.read("test", "newfile", (err, data) => {
  if (!err) {
    console.log(data);
  } else {
    console.error(err);
  }
});

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
  const parsedUrl = url.parse(req.url, true);

  /* Get the path */
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/|\/+$/g, "");

  /* Get the HTTP method */
  const method = req.method.toLowerCase();

  /* Get query */
  const queryStringObject = parsedUrl.query;

  /* Get Headers */
  const headers = req.headers;

  /* Get the payload if there is any */
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", data => (buffer += decoder.write(data)));

  req.on("end", () => (buffer += decoder.end()));

  const chosenHandler =
    typeof router[trimmedPath] !== "undefined"
      ? router[trimmedPath]
      : handlers.notFound;

  /* Construct the data object to send to the handler */
  const data = {
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
    const payloadString = JSON.stringify(payload);

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

/* Keep alive check route */
handlers.ping = (data, callback) => callback(200);

handlers.hello = (data, callback) => callback(200, { message: "Hello world!" });
/* Not found handler */
handlers.notFound = (data, callback) => callback(404);

const router = {
  ping: handlers.ping,
  hello: handlers.hello
};
