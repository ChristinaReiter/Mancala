export async function getRanking() {
  console.log("getRanking is called");
  try {
    const response = await fetch("/ranking");
    if (response.status == 200) {
      const result = await response.text();
      console.log("result", result);
    } else {
      console.error(
        "Get Ranking responded with",
        response?.status,
        response?.statusText
      );
    }
  } catch (error) {
    console.error("Error querying ranking", error);
  }
}
