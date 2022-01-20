const http = require("http");
const fs = require("fs");
const path = require("path");
const requests = require("./server/backend/requests.js");
require("./server/backend/database.js");

const frontendFolder = "server/frontend/";

http
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
      fs.readFile(
        path.join(__dirname, "./index.html"),
        "UTF-8",
        function (err, html) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(html);
        }
      );
      // handle all other requests with backend
    } else {
      requests.handleBackendRequest(req, res);
    }
  })
  .listen(8081, () => {
    console.log("server listening on http://localhost:8081");
  });
