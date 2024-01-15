export type LoginData = {
    userName: string;
    password: string;
}

export type LoginResponse = Response & {
    result: {
        accessToken: string;
    }
}