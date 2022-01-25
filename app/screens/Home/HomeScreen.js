import React from "react";
import { Text, StyleSheet, View } from "react-native";

function HomeScreen(props) {
	return (
		<View style={styles.container}>
			<Text>Hello Home</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default HomeScreen;
