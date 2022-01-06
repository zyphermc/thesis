import { React, useState } from "react";
import { Text, View, StyleSheet } from "react-native";

function HomeScreen({ navigation, route }) {
	const [isAdmin] = useState(route.params.isAdmin);

	const handleInventoryNav = () => {
		navigation.navigate("Inventory", {
			isAdmin: isAdmin,
		});
	};

	return (
		<View style={styles.container}>
			<Text>Home</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
});

export default HomeScreen;
