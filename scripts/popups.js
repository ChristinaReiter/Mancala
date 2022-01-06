// Rules Popup

let rulesDisplay = document.querySelector(".rules-overlay");
let rulesicon = document.querySelector(".help-icon");
let rulesbutton = document.querySelector(".rules-button");


rulesicon.addEventListener("click",function() {
    rulesDisplay.setAttribute("style", "display: list-item");
},false);

rulesbutton.addEventListener("click",function() {
    rulesDisplay.setAttribute("style", "display: none");
},false);

// Login Popup

let loginDisplay = document.querySelector(".login-overlay");
let loginicon = document.querySelector(".login-icon");
let loginbutton = document.querySelector(".login-button");


loginicon.addEventListener("click",function() {
    loginDisplay.setAttribute("style", "display: list-item");
},false);

loginbutton.addEventListener("click",function() {
    loginDisplay.setAttribute("style", "display: none");
},false);