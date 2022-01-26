import React from "react";
import { Text, StyleSheet, View, Image, Button, Alert, TouchableOpacity } from "react-native";

function HomeScreen(props) {
	const onPress = () => console.log("hello");
	return (

		<View style={styles.container}>
			<Image
				source={require('../../assets/images/home.jpg')}
				style={{ width: '100%', height: '100%', resizeMode: 'cover' }}>
			</Image>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default HomeScreen;
