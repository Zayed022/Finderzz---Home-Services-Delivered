const ADMIN_EMAIL = "admin@finderzz.com";
const ADMIN_PASSWORD = "123456";

export const login = (email, password) => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("admin_auth", "true");
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem("admin_auth");
};

export const isAuthenticated = () => {
  return localStorage.getItem("admin_auth") === "true";
};