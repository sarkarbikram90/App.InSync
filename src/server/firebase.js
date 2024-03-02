import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyBlnkP0V1EYa06DwpuzTQIEUjimalP9vdo", // Add API Key
  databaseURL:"orbital-highway-354106.appspot.com" // Add databaseURL
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase;

var firepadRef = firebase.database().ref();

export const userName = prompt("What's your name?");
const urlparams = new URLSearchParams(window.location.search);
const roomId = urlparams.get("id");

if (roomId) {
  firepadRef = firepadRef.child(roomId);
} else {
  firepadRef = firepadRef.push();
  window.history.replaceState(null, "Meet", "?id=" + firepadRef.key);
}

export default firepadRef;
