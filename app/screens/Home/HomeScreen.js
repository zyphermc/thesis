import { React } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

function HomeScreen({ route }) {
	const isAdmin = route.params.isAdmin;
	const navigation = useNavigation();

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
