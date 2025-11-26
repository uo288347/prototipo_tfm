
export let login = (username, password) => {
    localStorage.setItem("login", true);
}

export let clearLogin = () => {
    localStorage.removeItem("login");
}

export let isLoggedIn = () => {
    return localStorage.getItem("login") === "true";
}