import firebase from "firebase";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA30lCdGhrYNox4LDdlnAjfWuWrB3wNRJE",
  authDomain: "newsecret-39a48.firebaseapp.com",
  projectId: "newsecret-39a48",
  storageBucket: "newsecret-39a48.appspot.com",
  messagingSenderId: "880567042339",
  appId: "1:880567042339:web:88c5b512f5c97b409f8c96",
  measurementId: "G-4HF40YZ64V",
};
/*
try {
  firebase.initializeApp(firebaseConfig);
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error", err.stack);
  }
}*/

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, storage, auth, provider };
