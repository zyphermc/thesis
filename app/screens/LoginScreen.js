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
	ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

function LoginScreen(props) {
	//console.log("App Executed");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigation = useNavigation();

	//Logic for pressing the Sign in button
	const onSignInPressed = () => {
		console.log("Sign In");
		console.log(email);
		console.log(password);

		if (email === "tubol@gmail.com" && password === "igit") {
			navigation.navigate("Test");
		} else {
			console.warn("Wrong account details!");
		}
	};

	return (
		<ScrollView contentContainerStyle={{ flex: 1 }}>
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
					<View style={styles.inputView}>
						<TextInput
							style={styles.TextInput}
							placeholder="Email."
							placeholderTextColor="#003f5c"
							onChangeText={(email) => setEmail(email)}
						/>
					</View>

					<View style={styles.inputView}>
						<TextInput
							style={styles.TextInput}
							placeholder="Password."
							placeholderTextColor="#003f5c"
							secureTextEntry={true}
							onChangeText={(password) => setPassword(password)}
						/>
					</View>

					<TouchableOpacity onPress={onSignInPressed} style={styles.loginBtn}>
						<Text style={styles.loginText}>LOGIN</Text>
					</TouchableOpacity>
				</ImageBackground>
			</View>
		</ScrollView>
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
});

export default LoginScreen;
