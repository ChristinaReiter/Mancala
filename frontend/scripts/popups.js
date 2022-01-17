import { registerUser } from "./requests/requests.js";


// Rules Popup
let rulesDisplay = document.querySelector(".rules-overlay");
let rulesicon = document.querySelector(".help-icon");
let rulesbutton = document.querySelector(".rules-button");


rulesicon.addEventListener("click",function() {
    rulesDisplay.setAttribute("style", "display: list-item; z-index: 10;");
},false);

rulesbutton.addEventListener("click",function() {
    rulesDisplay.setAttribute("style", "display: none");
},false);

// Logout Popup
let logouticon = document.querySelector(".logout-icon");
let logoutDisplay = document.querySelector(".logout-overlay");
let logoutcancelbutton = document.querySelector(".logout-cancel-button");
let logoutbutton = document.querySelector(".logout-button");
let displayLogout = document.querySelector(".logout-container");

logouticon.addEventListener("click",function() {
    logoutDisplay.setAttribute("style", "display: list-item; z-index: 10;");
},false);

logoutcancelbutton.addEventListener("click",function() {
    logoutDisplay.setAttribute("style", "display: none");
},false);

logoutbutton.addEventListener("click",function() {
    reload();
},false);

// Login Popup

let loginDisplay = document.querySelector(".login-overlay");
let loginbutton = document.querySelector(".login-button");
let username = document.getElementById("username");
let password = document.getElementById("password");
let displayLoginForm = document.querySelector(".login-container");
let errorText = document.createElement("div");
errorText.className = "error-login-text";
errorText.innerHTML = "Invalid input.";


loginbutton.addEventListener("click",function() {
    let usernamevalue = username.innerHTML;
    let passwordvalue = password.innerHTML;
    if ( registerUser(usernamevalue, passwordvalue) == true) {
        loginDisplay.setAttribute("style", "display: none;");
        document.getElementById("start-game-popup").setAttribute("style", "display: block; z-index: 10;");
    } else {
        password.appendChild(errorText);
    }
},false);


//Ranking Popup

let rankingDisplay = document.querySelector(".ranking-overlay");
let rankingicon = document.querySelector(".ranking-icon");
let rankingbutton = document.querySelector(".ranking-button");


rankingicon.addEventListener("click",function() {
    rankingDisplay.setAttribute("style", "display: list-item; z-index: 10;");
},false);

rankingbutton.addEventListener("click",function() {
    rankingDisplay.setAttribute("style", "display: none;");
},false);