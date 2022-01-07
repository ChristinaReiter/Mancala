const ranking = [
  {
    name: "max",
    score: 1,
  },
  {
    name: "moritz",
    score: 2,
  },
];

module.exports.handleBackendRequest = (req, res) => {
  if (req.url === "/ranking") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(ranking));
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("No Page Found");
  }
};
