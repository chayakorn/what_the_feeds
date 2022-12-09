// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCKpj2QxjvDmv01MoJew7ipKCKCPyDA1rA",
    authDomain: "int305fb017.firebaseapp.com",
    projectId: "int305fb017",
    storageBucket: "int305fb017.appspot.com",
    messagingSenderId: "744177383028",
    appId: "1:744177383028:web:9f2b65547c182088eb4321",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// init firestore service
const db = getFirestore();

export default db;