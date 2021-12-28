import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	View,
	Image,
	TextInput,
	Button,
	TouchableOpacity,
	ImageBackground,
} from "react-native";

function LoginScreen(props) {
	console.log("App Executed");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

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

				<TouchableOpacity style={styles.loginBtn}>
					<Text style={styles.loginText}>LOGIN</Text>
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
		backgroundColor: "#FFC0CB",
		borderRadius: 30,
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

	forgot_button: {
		height: 30,
		marginBottom: 30,
	},

	loginBtn: {
		width: "80%",
		borderRadius: 25,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 40,
		backgroundColor: "#FF1493",
	},
});

export default LoginScreen;
