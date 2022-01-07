import React from "react";
import { Button, Text, View } from "react-native";

function AddProductModal(props) {
	return (
		<View>
			<Button title="Close" onPress={props.closeModal} />
		</View>
	);
}

export default AddProductModal;
