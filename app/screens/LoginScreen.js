import React from "react";
import {
	ImageBackground,
	StatusBar,
	StyleSheet,
	View,
	Image,
	Text,
} from "react-native";

function LoginScreen(props) {
	return (
		<ImageBackground
			source={require("../assets/login_background.jpg")}
			style={styles.background}
		>
			<View style={styles.logoContainer}>
				<Image
					style={styles.logo}
					source={require("../assets/login_logo.jpg")}
				/>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	logo: {
		width: 170,
		height: 170,
	},
	logoContainer: {
		position: "absolute",
		top: 80,
		alignItems: "center",
	},
});

export default LoginScreen;
