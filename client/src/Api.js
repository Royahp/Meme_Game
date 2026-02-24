async function logInUser(credentials) {
  const users = await fetch("http://localhost:3001/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  }).then((response) => response.json());
  return users;
}

async function logoutUser() {
  const response = await fetch("http://localhost:3001/api/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
  return response.json();
}
async function getCurrentUser() {
  const response = await fetch("http://localhost:3001/api/sessions/current", {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json());
  return response;
}

async function getMemeAndCaptions(preImageIds) {
  const response = await fetch(
    "http://localhost:3001/api/image&captions?preImageIds=" + preImageIds
  ).then((response) => response.json());
  return response;
}

async function verifyCaption(captionId, text, imageId) {
  const answer = await fetch("http://localhost:3001/api/verify-caption", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      captionId: parseInt(captionId),
      text: text,
      imageId: imageId,
    }),
  }).then((res) => res.json());
  return answer;
}
//inja dota gerefti
async function sendGameInfo(stepResponse) {
  const response = await fetch("http://localhost:3001/api/savingInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      //in step response e pain khodesh score dare dg lazem nist
      data: stepResponse,
    }),
  });
  return response;
}
async function showHistory() {
  const response = await fetch("http://localhost:3001/api/history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).then((response) => response.json());
  return response;
}

export {
  logInUser,
  getMemeAndCaptions,
  verifyCaption,
  sendGameInfo,
  showHistory,
  logoutUser,
  getCurrentUser,
};
