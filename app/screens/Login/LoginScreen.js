import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	TouchableOpacity,
	ImageBackground,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";

import { authentication, db } from "../../../firebase-config";

function LoginScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	const handleSignIn = () => {
		signInWithEmailAndPassword(authentication, email, password)
			.then(async (re) => {
				console.log(re);

				UpdateSignIn(true);
				setIsSignedIn(true);
				showMessage({
					message: "Successfully logged in!",
					type: "success",
				});

				const emailDocSnap = await getDoc(
					doc(db, "emails", email.toLowerCase())
				);
				setIsAdmin(emailDocSnap.data().isAdmin);
			})
			.catch((err) => {
				console.log(err);
				showMessage({
					message: "Wrong account details!",
					type: "danger",
				});
			});
	};

	const handleSignOut = () => {
		signOut(authentication)
			.then((re) => {
				console.log(re);

				UpdateSignIn(false);
				setIsSignedIn(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleContinue = () => {
		navigation.navigate("Drawer", {
			isAdmin: isAdmin,
		});
	};

	const UpdateSignIn = async (bool) => {
		const emailDocRef = doc(db, "emails", email.toLowerCase());

		//Update an existing document in collection
		await updateDoc(emailDocRef, {
			signedIn: bool,
		});
	};

	const navigation = useNavigation();

	return (
		<View style={styles.container}>
			<ImageBackground
				source={{ uri: "https://i.ibb.co/c6JhWvr/login-background.jpg" }}
				resizeMode="cover"
				style={styles.backgroundImage}
			>
				<Image
					style={styles.image}
					source={{ uri: "https://i.ibb.co/JrCV1wP/login-logo.jpg" }}
					resizeMode="contain"
				/>
				<StatusBar style="auto" />

				{isSignedIn ? (
					<View style={styles.inputView}>
						<Text style={{ marginTop: 10 }}>Signed is as {email}</Text>
					</View>
				) : (
					<View style={styles.inputView}>
						<TextInput
							style={styles.TextInput}
							placeholder="Email."
							placeholderTextColor="#003f5c"
							value={email}
							onChangeText={(text) => setEmail(text)}
						/>
					</View>
				)}

				{isSignedIn ? (
					<></>
				) : (
					<View style={styles.inputView}>
						<TextInput
							style={styles.TextInput}
							placeholder="Password."
							placeholderTextColor="#003f5c"
							secureTextEntry={true}
							value={password}
							onChangeText={(text) => setPassword(text)}
						/>
					</View>
				)}

				{isSignedIn ? (
					<TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
						<Text style={styles.loginText}>CONTINUE</Text>
					</TouchableOpacity>
				) : (
					<></>
				)}

				<TouchableOpacity
					style={isSignedIn ? styles.logoutBtn : styles.loginBtn}
					onPress={isSignedIn ? handleSignOut : handleSignIn}
				>
					<Text style={styles.loginText}>
						{isSignedIn ? "LOGOUT" : "LOGIN"}
					</Text>
				</TouchableOpacity>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	backgroundImage: {
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
		alignItems: "center",
	},

	image: {
		marginTop: 60,
		width: 200,
		height: 200,
		marginBottom: 40,
	},

	inputView: {
		backgroundColor: "#FFA775",
		borderRadius: 30,
		borderColor: "#000",
		borderWidth: 1,
		width: "70%",
		height: 45,
		marginBottom: 20,
		alignItems: "center",
	},

	inputView2: {
		backgroundColor: "#FFA775",
		borderRadius: 30,
		borderColor: "#000",
		borderWidth: 1,
		width: "70%",
		height: 45,
		marginTop: 20,
		marginBottom: 20,
		alignItems: "center",
	},

	TextInput: {
		height: 50,
		flex: 1,
		padding: 10,
		textAlign: "center",
	},

	loginBtn: {
		width: "80%",
		borderRadius: 25,
		borderColor: "#000",
		borderWidth: 1,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 40,
		backgroundColor: "#FF6123",
	},
	logoutBtn: {
		width: "80%",
		borderRadius: 25,
		borderColor: "#000",
		borderWidth: 1,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 20,
		backgroundColor: "red",
	},
	continueBtn: {
		width: "80%",
		borderRadius: 25,
		borderColor: "#000",
		borderWidth: 1,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 40,
		backgroundColor: "green",
	},
});

export default LoginScreen;
