import admin from "firebase-admin";
import { APPLICATION_CONFIG } from "../configs";
import { initializeApp } from "firebase-admin/app";

const initFireBaseApp = () => {
  const serviceAccount = APPLICATION_CONFIG.FIREBASE_SECRET_KEYS;

  initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

export default initFireBaseApp;