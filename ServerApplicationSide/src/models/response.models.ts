export type BaseResponse = {
    message?: string;
    status: string;
}

export type LoginResponse = BaseResponse & {
    result: {
        accessToken: string;
    }
}