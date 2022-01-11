const database = require("./database.js");

module.exports.handleBackendRequest = (req, res) => {
  if (req.url === "/ranking") {
    handleRanking(req, res);
  } else if (req.url === "/register") {
    handleRegisterUser(req, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("No Page Found");
  }
};

async function handleRegisterUser(req, res) {
  // TODO check for request type and correct parameters and return 400 if argument is missing
  const data = await parseData(req);
  console.log(data);
  const registeredSuccessfully = database.registerUser(
    data.username,
    data.password
  );
  if (!registeredSuccessfully) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end('{ "error": "User registered with a different password"}}');
  } else {
    res.writeHead(200);
    res.end();
  }
}

async function handleRanking(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  const ranking = database.getRankings();
  res.end(
    JSON.stringify({
      ranking,
    })
  );
}

async function parseData(req) {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const data = Buffer.concat(buffers).toString();
  return JSON.parse(data);
}
