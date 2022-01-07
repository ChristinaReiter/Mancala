export async function getRanking() {
  console.log("getRanking is called");
  try {
    const response = await fetch("/ranking");
    if (response.status == 200) {
      const result = await response.text();
      console.log("ranking result", result);
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
  // TODO passsword encryption
  console.log("registerUser is called");
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
      console.log("result", result);
    } else {
      console.error(
        "Register user responded with",
        response?.status,
        response?.statusText
      );
    }
  } catch (error) {
    console.error("Error registering user", error);
  }
}
