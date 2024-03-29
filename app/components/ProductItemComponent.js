import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

function ProductItemComponent(props) {
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
				<Text style={styles.textStyle}>
					Name:{" "}
					{props.category == "Food" ? (
						<Text
							style={{
								textDecorationLine: props.quantity <= 0 ? "line-through" : null,
							}}
						>
							{props.name}
						</Text>
					) : (
						<Text
							style={{
								textDecorationLine:
									props.quantities[0].quantity <= 0 ? "line-through" : null,
							}}
						>
							{props.name}
						</Text>
					)}
				</Text>
				<Text style={styles.textStyle}>Category: {props.category}</Text>
				{props.category == "Food" ? (
					<Text style={styles.textStyle}>Quantity: {props.quantity}</Text>
				) : (
					<View>
						<Text style={styles.textStyle}>Quantity: </Text>
						<Text style={styles.textStyle}>
							Small - {props.quantities[0].quantity}
						</Text>
						<Text style={styles.textStyle}>
							Medium - {props.quantities[1].quantity}
						</Text>
						<Text style={styles.textStyle}>
							Large - {props.quantities[2].quantity}
						</Text>
					</View>
				)}
				{props.category == "Food" ? (
					<Text
						style={[
							styles.textStyle,
							{ color: props.quantity > 0 ? "green" : "red" },
						]}
					>
						{props.quantity > 0 ? "Available" : "Not Available"}
					</Text>
				) : (
					<Text
						style={[
							styles.textStyle,
							{ color: props.quantities[0].quantity > 0 ? "green" : "red" },
						]}
					>
						{props.quantities[0].quantity > 0 ? "Available" : "Not Available"}
					</Text>
				)}
			</View>
			<View
				style={{
					flex: 1,
					alignItems: "flex-end",
				}}
			>
				<TouchableOpacity
					style={styles.buttonInside}
					onPress={() => {
						props.handleButtonView(props.name);
					}}
				>
					<Ionicons name="clipboard-outline" size={22} color={"white"} />
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.buttonInside, { backgroundColor: "red" }]}
					onPress={() => {
						props.handleButtonDelete(props.name);
					}}
				>
					<Ionicons name="trash-outline" size={22} color={"white"} />
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
		backgroundColor: "#E2B78D",
		borderColor: "black",
		borderWidth: 1,
		borderRadius: 12,
		padding: 5,
	},
	buttonInside: {
		width: 50,
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

export default ProductItemComponent;
