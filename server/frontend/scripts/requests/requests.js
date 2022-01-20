import { GROUP_NUMBER } from "./config.js";
import {
  getGame,
  getPassword,
  getUsername,
} from "../multiplayer/credentials.js";

const publicApi = "http://twserver.alunos.dcc.fc.up.pt:8008/";

export async function getRanking() {
  try {
    const response = await fetch("/ranking");
    if (response.status == 200) {
      const result = await response.text();
      return result;
    } else {
      console.error(
        "Get ranking responded with",
        response?.status,
        response?.statusText
      );
    }
  } catch (error) {
    console.error("Error querying ranking", error);
  }
}

export async function getRankingPublic() {
  try {
    const response = await fetch(publicApi + "ranking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    if (response.status == 200) {
      const result = await response.text();
      return result;
    } else {
      console.error(
        "Get ranking responded with",
        response?.status,
        response?.statusText
      );
    }
  } catch (error) {
    console.error("Error querying ranking", error);
  }
}

export async function registerUser(username, password) {
  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.status == 200) {
      const result = await response.text();
      return true;
    } else {
      console.error(
        "Register user responded with error",
        response?.status,
        response?.statusText
      );
      return false;
    }
  } catch (error) {
    console.error("Error registering user", error);
  }
}

export async function registerUserPublic(username, password) {
  try {
    const response = await fetch(publicApi + "register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nick: username, password }),
    });
    if (response.status == 200) {
      return true;
    } else {
      console.error(
        "Register user responded with error",
        response?.status,
        response?.statusText
      );
      return false;
    }
  } catch (error) {
    console.error("Error registering user", error);
  }
}

// input: {size, initial}
export async function join(input) {
  const username = getUsername();
  const password = getPassword();

  try {
    const response = await fetch(publicApi + "join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group: GROUP_NUMBER,
        nick: username,
        password: password,
        size: input.size,
        initial: input.initial,
      }),
    });
    if (response.status == 200) {
      return JSON.parse(await response.text()).game;
    } else {
      console.error(
        "Join responded with error",
        response?.status,
        response?.statusText
      );
      return false;
    }
  } catch (error) {
    console.error("Error joining", error);
  }
}

export async function notify(move) {
  const username = getUsername();
  const password = getPassword();
  const game = getGame();

  try {
    const response = await fetch(publicApi + "notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nick: username,
        password,
        game,
        move,
      }),
    });
    if (response.status == 200) {
      return JSON.parse(await response.text());
    } else {
      console.error(
        "Notify responded with error",
        response?.status,
        response?.statusText
      );
      return false;
    }
  } catch (error) {
    console.error("Error notifying", error);
  }
}

export async function leave() {
  const username = getUsername();
  const password = getPassword();
  const game = getGame();

  try {
    const response = await fetch(publicApi + "leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nick: username,
        password,
        game,
      }),
    });
    if (response.status == 200) {
      return JSON.parse(await response.text());
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error leaving", error);
  }
}
