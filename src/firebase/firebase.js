import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDZ4-W1ENdv2Ii2XtLO8dJ7vEnfZUl0Ngk",
  authDomain: "arena-stats.firebaseapp.com",
  databaseURL: "https://arena-stats.firebaseio.com",
  projectId: "arena-stats",
  storageBucket: "arena-stats.appspot.com",
  messagingSenderId: "728485370177",
  appId: "1:728485370177:web:3dd8ea2a99bf2c04fce9c0",
  measurementId: "G-617C4V05S7",
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }
  return userRef;
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

window.firebase = firebase;

export default firebase;
