export function createLoginButton(): void {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    const loginButton = document.createElement("button");
    loginButton.id = "login-button";
    loginButton.className = "button-class";
    loginButton.textContent = "Login to Spotify";
    loginButton.addEventListener("click", () => {
        window.location.href = "/spotify/login/";
    });
    buttonContainer.appendChild(loginButton);
    document.body.appendChild(buttonContainer);
}

export function createLogoutButton(logout: Function): void {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "button-container";
    const logoutButton = document.createElement("button");
    logoutButton.id = "logout-button";
    logoutButton.className = "button-class";
    logoutButton.textContent = "Log Out of Spotify";
    logoutButton.addEventListener("click", () => {
        logout();
        window.location.reload();
    });
    buttonContainer.appendChild(logoutButton);
    document.body.appendChild(buttonContainer);
}