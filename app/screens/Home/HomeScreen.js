import { React } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

function HomeScreen({ navigation, route }) {
	const { isAdmin } = route.params;

	const handleInventoryNav = () => {
		navigation.navigate("Inventory", {
			isAdmin: isAdmin,
		});
	};

	return (
		<View style={styles.container}>
			<Text>{isAdmin ? "Is Admin" : "Not Admin"}</Text>
			<Button title="My Inventory" onPress={handleInventoryNav} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default HomeScreen;
