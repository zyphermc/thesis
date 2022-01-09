import React from "react";
import { Button, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

function CheckoutModal(props) {
	return (
		<View>
			<TouchableOpacity style={styles.closeButton} onPress={props.closeModal}>
				<Ionicons name="close-outline" size={40} color={"black"} />
			</TouchableOpacity>
			<Text>CheckOUt</Text>
		</View>
	);
}
const styles = StyleSheet.create({
	closeButton: {
		position: "absolute",
		right: 10,
	},
})

export default CheckoutModal;
