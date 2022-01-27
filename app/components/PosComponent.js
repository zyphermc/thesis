import React, { useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

function PosComponent(props) {
	const [count, setCount] = useState(0);
	const onPressAdd = () => setCount((prevCount) => prevCount + 1);
	const onPressMinus = () => setCount((prevCount) => prevCount - 1, 0);
	const [itemPrice, SetItemPrice] = useState(0);
	const [selectedSize, SetSelectedSize] = useState("");
	const [availableQuantity, SetAvailableQuantity] = useState(0);

	//Drink quantities
	const [availableQuantitySmall, SetAvailableQuantitySmall] = useState(0);
	const [availableQuantityMedium, SetAvailableQuantityMedium] = useState(0);
	const [availableQuantityLarge, SetAvailableQuantityLarge] = useState(0);

	let selectedSizeFast = "";

	//Calculates how many orders the user can make based on recipe [Food]
	const CalculateQuantityFood = () => {
		let orderList = props.GetOrderProductList();

		if (orderList.length > 0) {
			//Find item in order list
			const order = orderList.find((item) => {
				if (item.size == "") {
					return item.productName == props.name;
				} else {
					return item.productName == props.name && item.size == selectedSize;
				}
			});

			//If order is not empty
			if (typeof order != "undefined") {
				const tempQuantity = props.quantity - order.quantity;
				SetAvailableQuantity(tempQuantity);
			}
		} else {
			SetAvailableQuantity(props.quantity);
		}
	};

	//Calculates how many orders the user can make based on recipe [Drinks]
	const CalculateQuantityDrink = () => {
		SetAvailableQuantitySmall(props.quantities[0].quantity);
		SetAvailableQuantityMedium(props.quantities[1].quantity);
		SetAvailableQuantityLarge(props.quantities[2].quantity);
	};

	const GetItemPrice = () => {
		if (props.category != "Food") {
			const tempPrice = props.selling_prices.find((element) => {
				return element.size === selectedSizeFast.toLowerCase();
			});

			SetItemPrice(tempPrice.selling_price);
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			if (props.category == "Food") {
				CalculateQuantityFood();
			} else {
				CalculateQuantityDrink();
			}
		}, [])
	);

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
				{props.category == "Food" ? (
					<Text style={styles.textStyle}>Quantity: {availableQuantity}</Text>
				) : (
					<View>
						<Text style={styles.textStyle}>Quantity: </Text>
						<Text style={styles.textStyle}>
							Small - {availableQuantitySmall}
						</Text>
						<Text style={styles.textStyle}>
							Medium - {availableQuantityMedium}
						</Text>
						<Text style={styles.textStyle}>
							Large - {availableQuantityLarge}
						</Text>
					</View>
				)}
				<Text style={styles.textStyle}>
					Selling Price: ₱
					{props.category === "Food" ? props.sellingPrice : itemPrice}
				</Text>
				{props.category == "Food" ? (
					<Text
						style={[
							styles.textStyle,
							{ color: availableQuantity > 0 ? "green" : "red" },
						]}
					>
						{availableQuantity > 0 ? "Available" : "Not Available"}
					</Text>
				) : (
					<Text
						style={[
							styles.textStyle,
							{ color: availableQuantitySmall > 0 ? "green" : "red" },
						]}
					>
						{availableQuantitySmall > 0 ? "Available" : "Not Available"}
					</Text>
				)}
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
							} else {
								showMessage({
									message: "Nothing to remove!",
									type: "danger",
								});
							}
						}}
					>
						<Ionicons name="remove-circle-outline" size={25} color={"black"} />
					</TouchableOpacity>

					<Text style={{ fontWeight: "bold", paddingHorizontal: 5 }}>
						{count}
					</Text>

					<TouchableOpacity
						onPress={() => {
							if (props.category == "Food") {
								if (availableQuantity > 0 && count < availableQuantity) {
									onPressAdd();
								} else {
									showMessage({
										message: "Not enough products!",
										type: "danger",
									});
								}
							} else {
								if (selectedSize == "Small") {
									if (
										availableQuantitySmall > 0 &&
										count < availableQuantitySmall
									) {
										onPressAdd();
									} else {
										showMessage({
											message: "Not enough products!",
											type: "danger",
										});
									}
								} else if (selectedSize == "Medium") {
									if (
										availableQuantityMedium > 0 &&
										count < availableQuantityMedium
									) {
										onPressAdd();
									} else {
										showMessage({
											message: "Not enough products!",
											type: "danger",
										});
									}
								} else if (selectedSize == "Large") {
									if (
										availableQuantityLarge > 0 &&
										count < availableQuantityLarge
									) {
										onPressAdd();
									} else {
										showMessage({
											message: "Not enough products!",
											type: "danger",
										});
									}
								} else {
									showMessage({
										message: "Choose a size!",
										type: "warning",
									});
								}
							}
						}}
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
						if (props.category == "Food") {
							if (availableQuantity > 0 && count > 0) {
								props.getOrderedProduct(
									props.name,
									count,
									props.category === "Food" ? props.sellingPrice : itemPrice,
									props.vat,
									props.imageURI,
									selectedSize
								);

								showMessage({
									message: `Sucessfully added ${count} ${props.name}`,
									type: "success",
								});

								setCount(0);
								CalculateQuantityFood();
							} else {
								if (availableQuantity > 0 && count <= 0) {
									showMessage({
										message: "Nothing to add to cart!",
										type: "warning",
									});
								} else {
									showMessage({
										message: "Not enough products!",
										type: "danger",
									});
								}
							}
						} else {
							if (selectedSize == "Small") {
								if (availableQuantitySmall > 0 && count > 0) {
									props.getOrderedProduct(
										props.name,
										count,
										props.category === "Food" ? props.sellingPrice : itemPrice,
										props.vat,
										props.imageURI,
										selectedSize
									);

									showMessage({
										message: `Sucessfully added ${count} ${selectedSize} ${props.name}`,
										type: "success",
									});

									setCount(0);
									SetSelectedSize("");
									CalculateQuantityFood();
								} else {
									if (availableQuantitySmall > 0 && count <= 0) {
										showMessage({
											message: "Nothing to add to cart!",
											type: "warning",
										});
									} else {
										showMessage({
											message: "Not enough products!",
											type: "danger",
										});
									}
								}
							} else if (selectedSize == "Medium") {
								if (availableQuantityMedium > 0 && count > 0) {
									props.getOrderedProduct(
										props.name,
										count,
										props.category === "Food" ? props.sellingPrice : itemPrice,
										props.vat,
										props.imageURI,
										selectedSize
									);

									showMessage({
										message: `Sucessfully added ${count} ${selectedSize} ${props.name}`,
										type: "success",
									});

									setCount(0);
									SetSelectedSize("");
									CalculateQuantityFood();
								} else {
									if (availableQuantityMedium > 0 && count <= 0) {
										showMessage({
											message: "Nothing to add to cart!",
											type: "warning",
										});
									} else {
										showMessage({
											message: "Not enough products!",
											type: "danger",
										});
									}
								}
							} else if (selectedSize == "Large") {
								if (availableQuantityLarge > 0 && count > 0) {
									props.getOrderedProduct(
										props.name,
										count,
										props.category === "Food" ? props.sellingPrice : itemPrice,
										props.vat,
										props.imageURI,
										selectedSize
									);

									showMessage({
										message: `Sucessfully added ${count} ${selectedSize} ${props.name}`,
										type: "success",
									});

									setCount(0);
									SetSelectedSize("");
									CalculateQuantityFood();
								} else {
									if (availableQuantityLarge > 0 && count <= 0) {
										showMessage({
											message: "Nothing to add to cart!",
											type: "warning",
										});
									} else {
										showMessage({
											message: "Not enough products!",
											type: "danger",
										});
									}
								}
							}
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
