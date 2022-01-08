import { React, useState } from "react";
import { Text, View, StyleSheet, ImageBackground } from "react-native";

function HomeScreen({ navigation, route }) {
	const [isAdmin] = useState(route.params.isAdmin);

	const handleInventoryNav = () => {
		navigation.navigate("Inventory", {
			isAdmin: isAdmin,
		});
	};

	return (
		<ImageBackground
			source={{
				uri: "https://i.pinimg.com/originals/6c/59/cd/6c59cd041f58cd43c9be81cfa2546f9d.jpg",
			}}
			style={styles.container}
		>
			<Text>Home</Text>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
});

export default HomeScreen;
