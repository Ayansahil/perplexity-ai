import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export async function register({ username, email, password }) {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
}

export async function getMe() {
  const response = await api.get("/api/auth/get-me")
  return response.data;
}

export async function updateProfile({ username, email }) {
  const response = await api.patch("/api/auth/update-profile", { username, email });
  return response.data;
}

export async function changePassword({ currentPassword, newPassword }) {
  const response = await api.patch("/api/auth/change-password", { currentPassword, newPassword });
  return response.data;
}
