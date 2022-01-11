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
let username = document.getElementsByName("username")
let usernamevalue = username.value



loginicon.addEventListener("click",function() {
    loginDisplay.setAttribute("style", "display: list-item; z-index: 10");
},false);

loginbutton.addEventListener("click",function() {
    loginDisplay.setAttribute("style", "display: none");

},false);

logincancelbutton.addEventListener("click",function() {
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