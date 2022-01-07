// TEMP FILE ONLY USED FOR EASIER DEVELOPMENT
// DEV SERVER STARTS INDEX.JS AND RESTARTS ON CHANGES IN /backend FOLDER

const fs = require("fs");
const path = require("path");
const child = require("child_process");

const fileName = "index.js";
const backendFolderName = path.join(__dirname, "/backend");
const frontendFolderName = path.join(__dirname, "/scripts");
const frontendRequestsFolderName = path.join(__dirname, "/scripts/requests");
const styleFolderName = path.join(__dirname, "/styles");

// watch the target files and folders
const backendWatcher = fs.watch(backendFolderName);
const frontendWatcher = fs.watch(frontendFolderName);
const frontendRequestsWatcher = fs.watch(frontendRequestsFolderName);
const styleWatcher = fs.watch(styleFolderName);
// create a child process for the target application
let currentChild = child.fork(fileName);

backendWatcher.on("change", hotReload);
frontendWatcher.on("change", hotReload);
frontendRequestsWatcher.on("change", hotReload);
styleWatcher.on("change", hotReload);

function hotReload() {
  // we assure we have only one child process at time
  if (currentChild) {
    currentChild.kill();
  }
  // reset the child process
  console.log("hot reloading index.js");
  currentChild = child.fork(fileName);
}
