const LOCALSTORAGE_KEYS = {
    JWT_TOKEN: 'jwt',
    CURRENT_USER: 'currentUser',
}

export function setCurrentUser(user) {
    let savingUser = user;
    if (typeof savingUser !== 'string') {
        savingUser = JSON.stringify(savingUser);
    }

    localStorage.setItem(LOCALSTORAGE_KEYS.CURRENT_USER, savingUser);
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.CURRENT_USER));
}

export function setToken(token) {
    localStorage.setItem(LOCALSTORAGE_KEYS.JWT_TOKEN, token);
}

export function getToken() {
    return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.JWT_TOKEN));
}

export function resetCurrentSession() {
    localStorage.removeItem(LOCALSTORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(LOCALSTORAGE_KEYS.JWT_TOKEN);
}