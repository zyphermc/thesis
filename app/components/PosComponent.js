import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

function PosComponent(props) {
	const CalculateQuantity = () => {
		//Calculates how many orders can the user make based on recipe
		console.log("Quantity Calculated");
	};
	const [count, setCount] = useState(0);
	const onPressAdd = () => setCount(prevCount => prevCount + 1);
	const onPressMinus = () => setCount(prevCount => prevCount - 1, 0);

	return (
		<View style={styles.container}>
			<Image
				source={{ uri: props.imageURI }}
				style={{
					width: 100,
					height: 100,
					borderRadius: 30,
					alignSelf: "center",
				}}
			/>
			<View style={styles.textContainer}>
				<Text style={styles.textStyle}>Name: {props.name}</Text>
				<Text style={styles.textStyle}>Category: {props.category}</Text>
				<Text style={styles.textStyle}>Quantity: {props.quantity}</Text>
				<Text style={styles.textStyle}>
					Selling Price: ₱{props.sellingPrice}
				</Text>
				<Text
					style={[
						styles.textStyle,
						{ color: props.quantity > 0 ? "green" : "red" },
					]}
				>
					{props.quantity > 0 ? "Available" : "Not Available"}
				</Text>
			</View>
			<View
				style={{
					flex: 1,
					alignItems: "flex-end",
				}}
			>
				<View
					style={{ flexDirection: 'row', alignItems: 'center' }}
				>
					<TouchableOpacity
						onPress={() => {
							if (count > 0) {
								onPressMinus();
							}
						}}
					>
						<Ionicons name="remove-circle-outline" size={25} color={"black"} />
					</TouchableOpacity>

					<Text
						style={{ fontWeight: 'bold', paddingHorizontal: 5 }}
					>
						{count}
					</Text>

					<TouchableOpacity
						onPress={onPressAdd}
					>
						<Ionicons name="add-circle-outline" size={25} color={"black"} />
					</TouchableOpacity>

				</View>

				<TouchableOpacity
					style={styles.buttonInside}
					onPress={() => {
						props.getOrderedProduct(props.name, count, props.sellingPrice, props.vat, props.imageURI);
						setCount(0);
					}}
				>
					<Ionicons name="cart-outline" size={35} color={"white"} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		marginVertical: 2,
		marginHorizontal: 5,
		backgroundColor: "#CCCC67",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 12,
		padding: 5,
	},
	buttonInside: {
		marginTop: 25,
		width: 100,
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#67BA64",
		margin: 2,
		borderWidth: 1,
		borderRadius: 6,
	},
	textContainer: {
		justifyContent: "center",
		paddingLeft: 5,
	},
	textStyle: {
		fontSize: 15,
		color: "black",
	},
});

export default PosComponent;
