const fs = require("fs");
const path = require("path");
const hashing = require("./hashing.js");

const userFile = path.join(__dirname, ".storage/users.json");
let users = null;

const rankingFile = path.join(__dirname, ".storage/ranking.json");
let ranking = null;
const initialRankingData = [
  { nick: "jpleal", victories: 2, games: 2 },
  { nick: "zp", victories: 0, games: 2 },
];

checkForFile(userFile, function () {
  fs.readFile(
    path.join(__dirname, ".storage/users.json"),
    function (err, data) {
      if (!err) {
        users = JSON.parse(data.toString());
      } else {
        console.error("Error reading users.json", err);
      }
    }
  );
});

checkForFile(
  rankingFile,
  function () {
    fs.readFile(
      path.join(__dirname, ".storage/ranking.json"),
      function (err, data) {
        if (!err) {
          ranking = JSON.parse(data.toString());
        } else {
          console.error("Error reading ranking.json", err);
        }
      }
    );
  },
  initialRankingData
);

module.exports.getRankings = () => {
  return ranking;
};

module.exports.registerUser = (username, password) => {
  if (!username || !password) {
    return false;
  }

  const hashedPassword = hashing.hashString(password);

  for (let user of users) {
    if (user?.username === username) {
      if (user.password === hashedPassword) {
        return true;
      } else {
        return false;
      }
    }
  }
  users.push({
    username,
    password: hashedPassword,
  });
  updateFile(userFile, users);
  return true;
};

function updateFile(fileName, data) {
  fs.writeFile(fileName, JSON.stringify(data), function (err) {
    if (!err) {
      console.log("Database: Successfully stored updated", fileName);
    } else {
      console.error("Database: Error storing updated", fileName);
    }
  });
}

//checks if the file exists.
//If it does, it just calls back.
//If it doesn't, then the file is created.
function checkForFile(fileName, callback, data = null) {
  fs.exists(fileName, function (exists) {
    if (exists) {
      callback();
    } else {
      fs.writeFile(
        fileName,
        data ? JSON.stringify(data) : "[]",
        { flag: "wx" },
        function (err, data) {
          callback();
        }
      );
    }
  });
}
