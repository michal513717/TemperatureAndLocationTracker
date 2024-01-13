import { AccountType } from "./database.models";


export type LoginCredentials = {
    userName: string,
    password: string;
};

export type UserCredentials = LoginCredentials;