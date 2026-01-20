const API = "http://localhost:8000";

export async function login(username) {
  return fetch(`${API}/login?username=${username}`, { method: "POST" });
}

export async function createRoom(owner, candidates) {
  return fetch(`${API}/room/create?owner=${owner}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(candidates)
  });
}

export async function voteRoom(room_id, username, candidate) {
  return fetch(`${API}/room/vote?room_id=${room_id}&username=${username}&candidate=${candidate}`, {
    method: "POST"
  });
}

export async function getResults(room_id) {
  return fetch(`${API}/room/results?room_id=${room_id}`);
}
