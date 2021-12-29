import React from "react";
import { Text, View, StyleSheet } from "react-native";

function TestScreen(props) {
	return (
		<View style={styles.container}>
			<Text>Hello World</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default TestScreen;
