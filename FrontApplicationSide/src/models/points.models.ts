export type Point = {
    temperature: number;
    humidity: number;
    author: string;
    createAt: Date;
    localization: {
        latitude: number;
        longitude: number
    }
}