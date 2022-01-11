import React from "react";
import { Button, Text, View } from "react-native";
import AddProductForm from "../Forms/AddProductForm";

function AddProductModal(props) {
	return <AddProductForm closeModal={props.closeModal} />;
}

export default AddProductModal;
