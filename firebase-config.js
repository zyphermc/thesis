import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { hidden_apiKey } from "./server_config";

const firebaseConfig = {
	apiKey: hidden_apiKey,
	authDomain: "thesis-39d63.firebaseapp.com",
	projectId: "thesis-39d63",
	storageBucket: "thesis-39d63.appspot.com",
	messagingSenderId: "1021047378031",
	appId: "1:1021047378031:web:663f88bdf6f0166b3cfd9a",
	measurementId: "G-7XETLJQ9NS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log(getAuth(app).currentUser);
export const authentication = getAuth(app);
