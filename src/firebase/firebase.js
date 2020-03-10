import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZ4-W1ENdv2Ii2XtLO8dJ7vEnfZUl0Ngk",
  authDomain: "arena-stats.firebaseapp.com",
  databaseURL: "https://arena-stats.firebaseio.com",
  projectId: "arena-stats",
  storageBucket: "arena-stats.appspot.com",
  messagingSenderId: "728485370177",
  appId: "1:728485370177:web:3dd8ea2a99bf2c04fce9c0",
  measurementId: "G-617C4V05S7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export const firestore = firebase.firestore();

window.firebase = firebase;

export default firebase;
