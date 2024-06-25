// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyB5b79qQqo8iRGGbeOYrE2yIzmTEQARvwU",
    authDomain: "healthhivenew1.firebaseapp.com",
    projectId: "healthhivenew1",
    storageBucket: "healthhivenew1.appspot.com",
    messagingSenderId: "470574140483",
    appId: "1:470574140483:web:98c53ffa3a4fd70022d8f6",
    measurementId: "G-LDHHPPYXPX"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage, ref };