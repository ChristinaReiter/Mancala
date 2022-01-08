const crypto = require("crypto");

module.exports.hashString = (value) => {
  return crypto.createHash("md5").update(value).digest("hex");
};
