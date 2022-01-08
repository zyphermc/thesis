import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

function IngredientItemComponent(props) {
	const GetStatusColor = () => {
		if (props.stock_status === "GOOD") {
			return styles.stock_levelGood;
		} else if (props.stock_status === "REORDER") {
			return styles.stock_levelReorder;
		} else {
			return styles.stock_levelLow;
		}
	};

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
				<Text style={styles.textStyle}>
					Quantity: {props.quantity} {props.unit_of_measurement.toLowerCase()}
				</Text>
				<Text style={styles.textStyle}>
					Stock Level:{" "}
					<Text style={[{ fontWeight: "bold" }, GetStatusColor()]}>
						{props.stock_status}
					</Text>
				</Text>
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
		backgroundColor: "#CCCC67",
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
	stock_levelGood: {
		color: "green",
	},
	stock_levelReorder: {
		color: "#FF8000",
	},
	stock_levelLow: {
		color: "red",
	},
});

export default IngredientItemComponent;
