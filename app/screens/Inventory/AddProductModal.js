import React from "react";
import { Button, Text, View } from "react-native";
import AddProductForm from "./AddProductForm";

function AddProductModal(props) {
	return (
		<View>
			<Button title="Close" onPress={props.closeModal} />
			<AddProductForm />
		</View>
	);
}

export default AddProductModal;
