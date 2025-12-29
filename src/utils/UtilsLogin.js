
const isBrowser = () => typeof window !== "undefined";

export let login = (username, password) => {
    if (!isBrowser()) return;
    localStorage.setItem("login", true);
}

export let clearLogin = () => {
    if (!isBrowser()) return;
    localStorage.removeItem("login");
}

export let isLoggedIn = () => {
    if (!isBrowser()) return false;
    return localStorage.getItem("login") === "true";
}