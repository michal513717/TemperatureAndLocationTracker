const ACCESS_TOKEN_KEY = "access_token";

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(value: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, value);
}

export function removeAccessToken(){
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}