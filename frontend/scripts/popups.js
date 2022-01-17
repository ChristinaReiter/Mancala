import { registerUser, getRanking } from "./requests/requests.js";

// Rules Popup
let rulesDisplay = document.querySelector(".rules-overlay");
let rulesicon = document.querySelector(".help-icon");
let rulesbutton = document.querySelector(".rules-button");

rulesicon.addEventListener(
  "click",
  function () {
    rulesDisplay.setAttribute("style", "display: list-item; z-index: 10;");
  },
  false
);

rulesbutton.addEventListener(
  "click",
  function () {
    rulesDisplay.setAttribute("style", "display: none");
  },
  false
);

// Logout Popup
let logouticon = document.querySelector(".logout-icon");
let logoutDisplay = document.querySelector(".logout-overlay");
let logoutcancelbutton = document.querySelector(".logout-cancel-button");
let logoutbutton = document.querySelector(".logout-button");
let displayLogout = document.querySelector(".logout-container");

logouticon.addEventListener(
  "click",
  function () {
    logoutDisplay.setAttribute("style", "display: list-item; z-index: 10;");
  },
  false
);

logoutcancelbutton.addEventListener(
  "click",
  function () {
    logoutDisplay.setAttribute("style", "display: none");
  },
  false
);

logoutbutton.addEventListener(
  "click",
  function () {
    window.top.location.reload(true);
  },
  false
);

// Login Popup

let loginDisplay = document.querySelector(".login-overlay");
let loginbutton = document.querySelector(".login-button");
let username = document.getElementById("username");
let password = document.getElementById("password");
let displayLoginForm = document.querySelector(".login-container");
let errorText = document.querySelector(".error-login-text");

loginbutton.addEventListener(
  "click",
  async function () {
    let usernamevalue = username.value;
    let passwordvalue = password.value;
    if (usernamevalue == "" || passwordvalue == "") {
      errorText.innerHTML = "Invalid input.";
    } else if (Boolean(registerUser(usernamevalue, passwordvalue)) == true) {
      loginDisplay.setAttribute("style", "display: none;");
      document
        .getElementById("start-game-popup")
        .setAttribute("style", "display: block; z-index: 10;");
    } else {
      errorText.innerHTML = "Invalid input.";
    }
  },
  false
);

//Ranking Popup

let rankingDisplay = document.querySelector(".ranking-overlay");
let rankingicon = document.querySelector(".ranking-icon");
let rankingbutton = document.querySelector(".ranking-button");

rankingicon.addEventListener(
  "click",
  async function () {
    rankingDisplay.setAttribute("style", "display: list-item; z-index: 10;");
    let result = await getRanking();
    let resultJSON = JSON.parse(result);
    let ranking = resultJSON.ranking;
    if (ranking.length > 10) ranking = ranking.slice(0, 10);
    let rankingELem = document.getElementById("ranking");
    rankingELem.innerHTML = "";
    for (let entry of ranking) {
      const { nick, victories, games } = entry;
      var rankingLi = document.createElement("li");
      rankingLi.className = "popup-text";
      rankingLi.innerHTML = nick;
      rankingELem.appendChild(rankingLi);
    }
  },
  false
);

rankingbutton.addEventListener(
  "click",
  function () {
    rankingDisplay.setAttribute("style", "display: none;");
  },
  false
);
