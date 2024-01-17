export type Point = {
    temperature: number;
    humidity: number;
    author: string;
    timeStamp: TimeStamp;
    localization: {
        latitude: number;
        longitude: number
    }
}

export type TimeStamp = {
    _seconds: number;
    _nanoseconds: number;
}