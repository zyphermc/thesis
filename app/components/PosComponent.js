import React from "react";
import {
	Text,
	View,
	StyleSheet,
	Image,
	TouchableOpacity,
	Alert,
} from "react-native";
import { useState } from "react";
//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

function PosComponent(props) {
	const CalculateQuantity = () => {
		//Calculates how many orders can the user make based on recipe
		console.log("Quantity Calculated");
	};
	const [count, setCount] = useState(0);
	const onPressAdd = () => setCount((prevCount) => prevCount + 1);
	const onPressMinus = () => setCount((prevCount) => prevCount - 1, 0);
	const [itemPrice, SetItemPrice] = useState(0);
	const [selectedSize, SetSelectedSize] = useState("");

	let selectedSizeFast = "";

	const GetItemPrice = () => {
		if (props.category != "Food") {
			const tempPrice = props.selling_prices.find((element) => {
				return element.size === selectedSizeFast.toLowerCase();
			});

			SetItemPrice(tempPrice.selling_price);
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
				<Text style={styles.textStyle}>
					Name:{" "}
					<Text
						style={{
							textDecorationLine: props.quantity <= 0 ? "line-through" : null,
						}}
					>
						{props.name}
					</Text>
				</Text>
				<Text style={styles.textStyle}>Category: {props.category}</Text>
				<Text style={styles.textStyle}>Quantity: {props.quantity}</Text>
				<Text style={styles.textStyle}>
					Selling Price: ₱
					{props.category === "Food" ? props.sellingPrice : itemPrice}
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
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<TouchableOpacity
						onPress={() => {
							if (count > 0) {
								onPressMinus();
							}
						}}
					>
						<Ionicons name="remove-circle-outline" size={25} color={"black"} />
					</TouchableOpacity>

					<Text style={{ fontWeight: "bold", paddingHorizontal: 5 }}>
						{count}
					</Text>

					<TouchableOpacity
						onPress={
							props.quantity > 0 && count <= props.quantity ? onPressAdd : null
						}
					>
						<Ionicons name="add-circle-outline" size={25} color={"black"} />
					</TouchableOpacity>
				</View>
				{props.category != "Food" ? (
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginTop: 50,
						}}
					>
						<TouchableOpacity
							style={[
								styles.sizeButton,
								{
									backgroundColor:
										selectedSize === "Small" ? "orange" : "transparent",
								},
							]}
							onPress={() => {
								SetSelectedSize("Small");
								selectedSizeFast = "Small";
								GetItemPrice();
							}}
						>
							<Text>S</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.sizeButton,
								{
									backgroundColor:
										selectedSize === "Medium" ? "orange" : "transparent",
								},
							]}
							onPress={() => {
								SetSelectedSize("Medium");
								selectedSizeFast = "Medium";
								GetItemPrice();
							}}
						>
							<Text>M</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.sizeButton,
								{
									backgroundColor:
										selectedSize === "Large" ? "orange" : "transparent",
								},
							]}
							onPress={() => {
								SetSelectedSize("Large");
								selectedSizeFast = "Large";
								GetItemPrice();
							}}
						>
							<Text>L</Text>
						</TouchableOpacity>
					</View>
				) : (
					<></>
				)}
				<TouchableOpacity
					style={styles.buttonInside}
					onPress={() => {
						if (props.quantity > 0) {
							props.getOrderedProduct(
								props.name,
								count,
								props.category === "Food" ? props.sellingPrice : itemPrice,
								props.vat,
								props.imageURI,
								selectedSize
							);
							setCount(0);
							SetSelectedSize("");
						} else {
							console.log("Not enough products!");
							Alert.alert("Not enough products!");
						}
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
	sizeButton: {
		padding: 5,
		width: 30,
		height: 30,
		borderWidth: 1,
		alignItems: "center",
	},
});

export default PosComponent;
