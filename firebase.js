// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1_F4FmnGIvaQG1Gp7z2sKNcxxv1eleMY",
    authDomain: "fir-auth-63ebb.firebaseapp.com",
    projectId: "fir-auth-63ebb",
    storageBucket: "fir-auth-63ebb.appspot.com",
    messagingSenderId: "199797178400",
    appId: "1:199797178400:web:054ec524b1b59058653c45"
};

let app;
if (firebase.getApps().length === 0) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.getApp()
}
// Initialize Firebase
// const auth = firebase.auth()
const auth = getAuth();
const db = getFirestore();
async function getUser(db) {
    const usercol = collection(db, 'projects');
    const snapshot = await getDocs(usercol);
    const list = snapshot.docs.map(doc => doc.data());
    console.log(list);
}

export { auth, db }