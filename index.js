const http = require("http");
// package needs to be installed but is used in the course's tutorial so should be fine
// https://www.dcc.fc.up.pt/~zp/SeWenta/LTW21/ : Theoretical/Server/Node/Examples/Galo/modules
const WebSocketServer = require("websocket").server;
const fs = require("fs");
const path = require("path");
const requests = require("./backend/requests.js");
require("./backend/database.js");

const frontendFolder = "frontend/";

const httpServer = http
  .createServer(function (req, res) {
    // serve .css files
    if (req.url.match(".css$")) {
      const cssPath = path.join(__dirname, frontendFolder, req.url);
      const fileStream = fs.createReadStream(cssPath, "UTF-8");
      res.writeHead(200, { "Content-Type": "text/css" });
      fileStream.pipe(res);
      // serve .js files
    } else if (req.url.match(".js$")) {
      const jsPath = path.join(__dirname, frontendFolder, req.url);
      const fileStream = fs.createReadStream(jsPath, "UTF-8");
      res.writeHead(200, { "Content-Type": "application/javascript" });
      fileStream.pipe(res);
      // serve .png files
    } else if (req.url.match(".png$")) {
      const imagePath = path.join(__dirname, frontendFolder, req.url);
      const fileStream = fs.createReadStream(imagePath);
      res.writeHead(200, { "Content-Type": "image/png" });
      fileStream.pipe(res);
      // serve main html on /
    } else if (req.url === "/") {
      fs.readFile("./frontend/main.html", "UTF-8", function (err, html) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(html);
      });
      // handle all other requests with backend
    } else {
      requests.handleBackendRequest(req, res);
    }
  })
  .listen(8081, () => {
    console.log("server listening on http://localhost:8081");
  });

// dummy web socket server that accepts and prints messages for now
new WebSocketServer({
  httpServer,
}).on("request", function (request) {
  var connection = request.accept(null, request.origin);
  console.log(new Date() + " Connection accepted.");
  connection.on("message", function (message) {
    console.log("receiving message");
    if (message.type === "utf8") {
      console.log("Received Message: " + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    } else if (message.type === "binary") {
      console.log(
        "Received Binary Message of " + message.binaryData.length + " bytes"
      );
      connection.sendBytes(message.binaryData);
    }
  });
  connection.on("close", function (_, _) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });
});
