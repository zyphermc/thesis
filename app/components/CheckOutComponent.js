import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	StyleSheet,
	Image,
	TouchableOpacity,
	Button,
	Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

function CheckOutComponent(props) {
	const { name, imageURI, quantity, sellingPrice, vat, size } = props;

	//Log
	//Get All Orders Made to Array
	useEffect(() => {
		let orderLog = {
			productName: { name },
			quantity: { quantity },
			sellingPrice: { sellingPrice },
			size: "",
			totalValue: "",
		};
	}, []);

	return (
		<View
			style={{
				flex: 1,
				flexDirection: "row",
				justifyContent: "space-between",
				marginHorizontal: 15,
			}}
		>
			<View
				style={{
					flex: 1,
				}}
			>
				<Text>{quantity}</Text>
			</View>
			<View
				style={{
					flex: 1,
				}}
			>
				<Text>{size}</Text>
			</View>
			<View
				style={{
					flex: 2,
					marginLeft: 50,
				}}
			>
				<Text>{name}</Text>
			</View>
			<View
				style={{
					flex: 1,
					marginLeft: 20,
				}}
			>
				<Text>{sellingPrice * quantity}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
		marginBottom: 10,
		borderRadius: 10,
		borderColor: "black",
	},
	image: {
		width: 90,
		height: 90,
	},
	textStyle: {
		width: 75,
		marginLeft: 10,
		fontWeight: "bold",
		fontSize: 15,
	},
});

export default CheckOutComponent;
