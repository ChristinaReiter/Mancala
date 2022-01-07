// TEMP FILE ONLY USED FOR EASIER DEVELOPMENT

const fs = require("fs");
const path = require("path");
const child = require("child_process");

const fileName = "index.js";
const folderName = path.join(__dirname, "/backend");

// watch the target file
const watcher = fs.watch(folderName);
// create a child process for the target application
let currentChild = child.fork(fileName);

watcher.on("change", () => {
  // we assure we have only one child process at time
  if (currentChild) {
    currentChild.kill();
  }
  // reset the child process
  console.log("hot reloading index.js");
  currentChild = child.fork(fileName);
});
