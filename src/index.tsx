import * as React from "react";
import { render } from "react-dom";
import firebase from "firebase/app";
import App from "./App";

/// - Firebase
import "firebase/analytics";
import "firebase/database";

var firebaseConfig = {
  apiKey: "AIzaSyDagFYr1n08Q59wbyTMMa6lkUa7hwEoWVA",
  authDomain: "who-is-there-app.firebaseapp.com",
  projectId: "who-is-there-app",
  storageBucket: "who-is-there-app.appspot.com",
  messagingSenderId: "464817139415",
  appId: "1:464817139415:web:5a1e0b68a48b7d71fe0a92",
  measurementId: "G-QGMTLZH1CT"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

/// - App
const rootElement = document.getElementById("root");
render(<App />, rootElement);
