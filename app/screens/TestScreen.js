import { React, useState } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

import { adminList } from "./Login/AdminList";

function TestScreen({ route }) {
	const [isAdmin, setIsAdmin] = useState(false);

	//Import data from Login Screen
	const { email } = route.params;

	//Check if email is admin
	if (adminList.includes(email) && !isAdmin) {
		setIsAdmin(true);
	}

	console.log("Is Admin: " + isAdmin);

	const handleTest = () => {
		if (isAdmin) {
			setIsAdmin(false);
		} else {
			setIsAdmin(true);
		}
	};

	return (
		<View style={styles.container}>
			<Text>{isAdmin ? "Yes" : "No"}</Text>
			<Button title="Show Details" onPress={handleTest} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default TestScreen;
