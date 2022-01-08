import React from "react";
import { Button, Text, View } from "react-native";
import AddIngredientForm from "../Forms/AddIngredientForm";

function AddIngredientModal(props) {
	return (
		<View>
			<Button title="Close" onPress={props.closeModal} />
			<AddIngredientForm />
		</View>
	);
}

export default AddIngredientModal;
