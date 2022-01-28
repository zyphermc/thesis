import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { showMessage } from "react-native-flash-message";
import { db } from "../../firebase-config";
import {
	collection,
	onSnapshot,
	updateDoc,
	increment,
	doc,
} from "firebase/firestore";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

function PosComponent(props) {
	const [count, setCount] = useState(0);
	const updaterCollectionRef = collection(db, "updater");
	const onPressAdd = () => setCount((prevCount) => prevCount + 1);
	const onPressMinus = () => setCount((prevCount) => prevCount - 1, 0);
	const [itemPrice, SetItemPrice] = useState(0);
	const [selectedSize, SetSelectedSize] = useState("");

	const [availableQuantity, SetAvailableQuantity] = useState(-1);

	//Drink quantities
	const [availableQuantitySmall, SetAvailableQuantitySmall] = useState(-1);
	const [availableQuantityMedium, SetAvailableQuantityMedium] = useState(-1);
	const [availableQuantityLarge, SetAvailableQuantityLarge] = useState(-1);

	//Updater Count
	const [updaterCount, SetUpdaterCount] = useState(0);

	let selectedSizeFast = "";

	let availableQuantityFast = 0;
	let availableQuantitySmallFast = 0;
	let availableQuantityMediumFast = 0;
	let availableQuantityLargeFast = 0;

	if (props.category == "Food") {
		availableQuantityFast = props.quantity;
	} else {
		availableQuantitySmallFast = props.quantities[0].quantity;
		availableQuantityMediumFast = props.quantities[1].quantity;
		availableQuantityLargeFast = props.quantities[2].quantity;
	}

	const updateUpdater = async () => {
		await updateDoc(doc(db, "updater", "update"), {
			count: increment(1),
		});

		let tempCount = updaterCount;
		SetUpdaterCount(++tempCount);
	};

	const CalculateProductMaxQuantity = async () => {
		if (count > 0) {
			props.deductItemsLocally(
				props.name,
				props.category,
				props.recipe,
				count,
				selectedSize
			);
		}

		if (props.ingredients.length > 0) {
			if (props.category == "Food") {
				let product_quantities = [];
				let availableQuantity = 0;

				props.recipe.map((ingredient) => {
					const dbIngredient = props.ingredients.find((item) => {
						return item.ingredient_name === ingredient.name;
					});

					let tempQuantity = Math.floor(
						dbIngredient.ingredient_stock / ingredient.amount
					);

					product_quantities.push(tempQuantity);
				});

				availableQuantity = Math.min(...product_quantities);

				if (availableQuantity >= 0) {
					SetAvailableQuantity(availableQuantity);
					availableQuantityFast = availableQuantity;
				} else {
					SetAvailableQuantity(0);
					availableQuantityFast = 0;
				}
			} else {
				let availableQuantities = [];

				props.quantities.map(async (quantity) => {
					let product_quantities = [];

					let availableQuantity = 0;

					//Get recipe according to size
					const myRecipe = props.recipe.find((item) => {
						return item.size === quantity.size;
					});

					//Iterate through each ingredient and get the max order quantity
					myRecipe.ingredients.map((ingredient) => {
						const dbIngredient = props.ingredients.find((item) => {
							return item.ingredient_name === ingredient.name;
						});

						let tempQuantity = Math.floor(
							dbIngredient.ingredient_stock / ingredient.amount
						);

						product_quantities.push(tempQuantity);
					});

					availableQuantity = Math.min(...product_quantities);

					if (availableQuantity > 0) {
						availableQuantities.push(availableQuantity);
					} else {
						availableQuantities.push(0);
					}
				});

				SetAvailableQuantitySmall(availableQuantities[0]);
				SetAvailableQuantityMedium(availableQuantities[1]);
				SetAvailableQuantityLarge(availableQuantities[2]);
				availableQuantitySmallFast = availableQuantities[0];
				availableQuantityMediumFast = availableQuantities[1];
				availableQuantityLargeFast = availableQuantities[2];
			}
		}
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
			CalculateProductMaxQuantity();
		}, [])
	);

	useEffect(() => {
		//Get Updater from Firestore
		const getUpdater = async () => {
			const unsub = onSnapshot(updaterCollectionRef, (docsSnapshot) => {
				docsSnapshot.docChanges().forEach(async (change) => {
					if (change.type === "added" || change.type === "modified") {
						CalculateProductMaxQuantity();
					}
				});
			});
		};

		getUpdater();
	}, []);

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
								textDecorationLine:
									availableQuantityFast <= 0 ? "line-through" : null,
							}}
						>
							{props.name}
						</Text>
					) : (
						<Text
							style={{
								textDecorationLine:
									availableQuantitySmallFast <= 0 ? "line-through" : null,
							}}
						>
							{props.name}
						</Text>
					)}
				</Text>
				<Text style={styles.textStyle}>Category: {props.category}</Text>
				{props.category == "Food" ? (
					<Text style={styles.textStyle}>
						Quantity:{" "}
						{availableQuantity != -1
							? availableQuantity
							: availableQuantityFast}
					</Text>
				) : (
					<View>
						<Text style={styles.textStyle}>Quantity: </Text>
						<Text style={styles.textStyle}>
							Small -{" "}
							{availableQuantitySmall != -1
								? availableQuantitySmall
								: availableQuantitySmallFast}
						</Text>
						<Text style={styles.textStyle}>
							Medium -{" "}
							{availableQuantityMedium != -1
								? availableQuantityMedium
								: availableQuantityMediumFast}
						</Text>
						<Text style={styles.textStyle}>
							Large -{" "}
							{availableQuantityLarge != -1
								? availableQuantityLarge
								: availableQuantityLargeFast}
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
							{ color: availableQuantityFast > 0 ? "green" : "red" },
						]}
					>
						{availableQuantityFast > 0 ? "Available" : "Not Available"}
					</Text>
				) : (
					<Text
						style={[
							styles.textStyle,
							{ color: availableQuantitySmallFast > 0 ? "green" : "red" },
						]}
					>
						{availableQuantitySmallFast > 0 ? "Available" : "Not Available"}
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
								if (
									availableQuantityFast > 0 &&
									count < availableQuantityFast
								) {
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
										availableQuantitySmallFast > 0 &&
										count < availableQuantitySmallFast
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
										availableQuantityMediumFast > 0 &&
										count < availableQuantityMediumFast
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
										availableQuantityLargeFast > 0 &&
										count < availableQuantityLargeFast
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
							if (availableQuantityFast > 0 && count > 0) {
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

								CalculateProductMaxQuantity();
								updateUpdater();
								setCount(0);
							} else {
								if (availableQuantityFast > 0 && count <= 0) {
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
								if (availableQuantitySmallFast > 0 && count > 0) {
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

									CalculateProductMaxQuantity();
									updateUpdater();
									setCount(0);
									SetSelectedSize("");
								} else {
									if (availableQuantitySmallFast > 0 && count <= 0) {
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
								if (availableQuantityMediumFast > 0 && count > 0) {
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

									CalculateProductMaxQuantity();
									updateUpdater();
									setCount(0);
									SetSelectedSize("");
								} else {
									if (availableQuantityMediumFast > 0 && count <= 0) {
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
								if (availableQuantityLargeFast > 0 && count > 0) {
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

									CalculateProductMaxQuantity();
									updateUpdater();
									setCount(0);
									SetSelectedSize("");
								} else {
									if (availableQuantityLargeFast > 0 && count <= 0) {
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
