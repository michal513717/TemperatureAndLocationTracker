require('dotenv').config(); 

export const APPLICATION_CONFIG = {
    DEBUG_REQUEST: true, // Show infomation about incoming request
    PORT: 8080, // Server run at this port
    FIREBASE_SECRET_KEYS: require("../utils/firebase/temperatureandlocationtracker-firebase-adminsdk-q6ujr-38b28b301e.json"), // should be share from admin
    JWT_SECRET_KEY: process.env?.SECRET_KEY ?? "" // Secret key should be define in env file
}