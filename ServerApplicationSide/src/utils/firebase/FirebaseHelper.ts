import firebase from "firebase-admin";

export class FirebaseHelper {
  public static converterAssignTypes<T extends {}>() {
    return {
      toFirestore(doc: T): FirebaseFirestore.DocumentData {
        return doc;
      },
      fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): T {
        return snapshot.data()! as T;
      }
    };
  };

  public static getServerTimeStamp(){
    return firebase.firestore.FieldValue.serverTimestamp();
  }
}