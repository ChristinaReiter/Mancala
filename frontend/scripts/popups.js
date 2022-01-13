// Rules Popup

let rulesDisplay = document.querySelector(".rules-overlay");
let rulesicon = document.querySelector(".help-icon");
let rulesbutton = document.querySelector(".rules-button");


rulesicon.addEventListener("click",function() {
    rulesDisplay.setAttribute("style", "display: list-item; z-index: 10");
},false);

rulesbutton.addEventListener("click",function() {
    rulesDisplay.setAttribute("style", "display: none");
},false);

// Login Popup

let loginDisplay = document.querySelector(".login-overlay");
let loginicon = document.querySelector(".login-icon");
let loginbutton = document.querySelector(".login-button");
let logincancelbutton = document.querySelector(".login-cancel-button");
let logoutcancelbutton = document.querySelector(".logout-cancel-button");
let username = document.getElementById("username");
let password = document.getElementById("password");
let logoutbutton = document.querySelector(".logout-button");

let displayLoginForm = document.querySelector(".login-container");
let displayLogout = document.querySelector(".logout-container");


loginicon.addEventListener("click",function() {
    loginDisplay.setAttribute("style", "display: list-item; z-index: 10");
},false);

loginbutton.addEventListener("click",function() {
    loginDisplay.setAttribute("style", "display: none");
    displayLoginForm.setAttribute("style", "display: none");
    displayLogout.setAttribute("style", "display: list-item");
},false);

logoutbutton.addEventListener("click",function() {
    loginDisplay.setAttribute("style", "display: none");
    displayLoginForm.setAttribute("style", "display: list-item");
    displayLogout.setAttribute("style", "display: none");
},false);


logincancelbutton.addEventListener("click",function() {
    loginDisplay.setAttribute("style", "display: none");
},false);

logoutcancelbutton.addEventListener("click",function() {
    loginDisplay.setAttribute("style", "display: none");
},false);



//Ranking Popup

let rankingDisplay = document.querySelector(".ranking-overlay");
let rankingicon = document.querySelector(".ranking-icon");
let rankingbutton = document.querySelector(".ranking-button");


rankingicon.addEventListener("click",function() {
    rankingDisplay.setAttribute("style", "display: list-item; z-index: 10");
},false);

rankingbutton.addEventListener("click",function() {
    rankingDisplay.setAttribute("style", "display: none");
},false);