import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	Alert,
	LogBox,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

//Database
import {
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase-config";

import CartComponent from "../../components/CartComponent";

LogBox.ignoreLogs([
	"Non-serializable values were found in the navigation state",
]);

function Cart(props, route) {
	const [orderProductList, SetOrderProductList] = useState(
		props.route.params.orderProductList
	);
	const [ingredients, SetIngredients] = useState(
		props.route.params.ingredients
	);
	const [products, SetProducts] = useState(props.route.params.products);
	const [totalValue, setTotalValue] = useState(0);

	let Tax = 0;
	let Subtotal = 0;

	Tax = totalValue * 0.12;
	Subtotal = totalValue - Tax;

	let cashTendered = "";

	const getCurrentDate = () => {
		var date = new Date().getDate();
		var month = new Date().getMonth() + 1;
		var year = new Date().getFullYear();

		return year + "-" + month + "-" + date;
	};

	const currentDate = getCurrentDate();

	const navigation = useNavigation();

	const getTotalValue = () => {
		let temp = 0;
		orderProductList.forEach((element) => {
			temp += element.sellingPrice * element.quantity;
		});
		setTotalValue(temp);
	};

	useEffect(() => {
		getTotalValue();
	}, []);

	const CalculateProductMaxQuantity = (name) => {
		if (products.length > 0 && ingredients.length > 0) {
			const product = products.find((item) => {
				return item.product_name === name;
			});

			let availableQuantities = product.product_quantities;

			product.product_quantities.map((quantity, index) => {
				let product_quantities = [];

				let availableQuantity = 0;

				//Get recipe according to size
				const myRecipe = product.recipe.find((item) => {
					return item.size === quantity.size;
				});

				//Iterate through each ingredient and get the max order quantity
				myRecipe.ingredients.map((ingredient) => {
					const dbIngredient = ingredients.find((item) => {
						return item.ingredient_name === ingredient.name;
					});

					let tempQuantity = Math.floor(
						dbIngredient.ingredient_stock / ingredient.amount
					);

					product_quantities.push(tempQuantity);
				});

				availableQuantity = Math.min(...product_quantities);

				availableQuantities[index].quantity = availableQuantity;
			});

			return availableQuantities;
		}
	};

	const deductItems = async (orderList) => {
		//OPTIMIZE THIS CODE  - 1/30/2022 11:35PM RICHARD
		let deductionList = [];
		let promiseList = [];
		const startTime = performance.now();

		orderList.forEach(async (order) => {
			if (order.quantity > 0) {
				//In the list of products, find the product matching "name"
				const myProduct = products.find((product) => {
					return product.product_name.includes(order.productName);
				});

				//Log each ordered item in products
				const prodDocRef = doc(db, "products", order.productName);

				let productHistory = myProduct.history;

				//Check if product is not drink (to not use size)
				if (myProduct.product_category != "Drinks") {
					//Update History and Quantity
					let orderLog = {
						type: "",
						name: "",
						amount: 0,
						date: "",
						totalValue: 0,
					};

					orderLog.type = "Ordered";
					orderLog.name = order.productName;
					orderLog.amount = order.quantity;
					orderLog.date = currentDate;
					orderLog.totalValue = order.sellingPrice * order.quantity;

					productHistory.push(orderLog);

					//update product history
					const productUpdatePromise = updateDoc(prodDocRef, {
						product_quantity: increment(-order.quantity),
						history: productHistory,
					});

					promiseList.push(productUpdatePromise);

					//On each ingredient in the recipe, do stuff
					myProduct.recipe.map(async (ingredient) => {
						if (deductionList.some((item) => item.name == ingredient.name)) {
							const itemIndex = deductionList.findIndex(
								(item) => item.name == ingredient.name
							);

							deductionList[itemIndex].amount +=
								ingredient.amount * order.quantity;
						} else {
							deductionList.push({
								name: ingredient.name,
								amount: ingredient.amount * order.quantity,
							});
						}
					});
				} else {
					if (typeof order.size != "undefined") {
						//Update History and Quantity
						let orderLog = {
							type: "",
							name: "",
							size: "",
							amount: 0,
							date: "",
							totalValue: 0,
						};

						orderLog.type = "Ordered";
						orderLog.name = order.productName;
						orderLog.size = order.size;
						orderLog.amount = order.quantity;
						orderLog.date = currentDate;
						orderLog.totalValue = order.sellingPrice * order.quantity;

						productHistory.push(orderLog);

						let calculatedQuantities = CalculateProductMaxQuantity(
							order.productName
						);

						//update product history
						const productUpdatePromise = updateDoc(prodDocRef, {
							product_quantities: calculatedQuantities,
							history: productHistory,
						});

						promiseList.push(productUpdatePromise);

						myProduct.recipe.map((recipe) => {
							if (order.size.toLowerCase() === recipe.size) {
								recipe.ingredients.map((ingredient) => {
									if (
										deductionList.some((item) => item.name == ingredient.name)
									) {
										const itemIndex = deductionList.findIndex(
											(item) => item.name == ingredient.name
										);

										deductionList[itemIndex].amount +=
											ingredient.amount * order.quantity;
									} else {
										deductionList.push({
											name: ingredient.name,
											amount: ingredient.amount * order.quantity,
										});
									}
								});
							}
						});
					}
				}
			}
		});

		deductionList.forEach(async (item) => {
			//access ingredient document from firebase and deduct amount
			const docRef = doc(db, "ingredients", item.name);

			const myIngredient = ingredients.find(
				(ingred) => ingred.ingredient_name == item.name
			);
			let ingredientHistory = myIngredient.history;

			let ingredientLog = {
				type: "",
				name: "",
				amount: 0,
				date: "",
			};

			ingredientLog.type = "Deducted";
			ingredientLog.name = item.name;
			ingredientLog.amount = item.amount;
			ingredientLog.date = currentDate;

			ingredientHistory.push(ingredientLog);

			//update document and deduct the amount
			const ingredientUpdatePromise = updateDoc(docRef, {
				ingredient_stock: increment(-item.amount),
				history: ingredientHistory,
			});
			promiseList.push(ingredientUpdatePromise);
		});

		const promiseResult = await Promise.all(promiseList);
		const endTime = performance.now();
		console.log(
			`EXECUTED ${promiseResult.length} PROMISES IN ${Math.round(
				(endTime - startTime) / 1000
			)} SECONDS`
		);
	};

	const RemoveProductFromList = (name, size) => {
		if (orderProductList.length > 0) {
			let productIndex = orderProductList.findIndex((item) => {
				if (size === "") {
					return item.productName == name;
				} else {
					return item.productName == name && item.size == size;
				}
			});

			if (productIndex >= 0) {
				if (orderProductList[productIndex].quantity > 0) {
					let tempList = orderProductList;
					tempList[productIndex].quantity--;
					SetOrderProductList(tempList);
					getTotalValue();
				}
			}
		}
	};

	const GetHeader = () => {
		return (
			<View
				style={{
					width: "100%",
					height: 30,
					backgroundColor: "black",
					justifyContent: "center",
				}}
			>
				<Text
					style={{
						fontSize: 18,
						fontWeight: "bold",
						color: "white",
						marginLeft: 100,
					}}
				>
					Product---Qty---Price---Total
				</Text>
			</View>
		);
	};

	const GetFooter = () => {
		return (
			<View>
				<View style={{ flex: 1 }}>
					<View
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							bottom: 0,
							height: 7,
							justifyContent: "center",
							backgroundColor: "orange",
						}}
					/>
				</View>
				<View
					style={{
						flex: 1,
						margin: 10,
						flexDirection: "row",
					}}
				>
					<View style={{ paddingRight: 15 }}>
						<Text style={styles.bottomText}>Subtotal:</Text>
						<Text style={styles.bottomText}>Tax (12%):</Text>
						<Text style={styles.bottomText}>Total: </Text>
						<Text style={styles.bottomText}>Cash tendered: </Text>
					</View>

					<View>
						<Text style={{ fontSize: 20 }}>₱{Subtotal.toFixed(2)}</Text>
						<Text style={{ fontSize: 20 }}>₱{Tax.toFixed(2)}</Text>
						<Text style={{ fontSize: 20 }}>₱{totalValue.toFixed(2)}</Text>
						<TextInput
							style={{ height: 30, width: 130, fontSize: 20 }}
							placeholder="Input Amount"
							onChangeText={(text) => (cashTendered = text)}
							defaultValue={cashTendered.toString()}
							keyboardType="number-pad"
						/>
					</View>

					<TouchableOpacity
						style={{
							position: "absolute",
							height: 35,
							width: 110,
							right: 6,
							borderRadius: 4,
							borderWidth: 2,
							borderColor: "black",
							backgroundColor: "orange",
							alignSelf: "center",
							alignItems: "center",
							justifyContent: "center",
						}}
						onPress={() => {
							if (cashTendered >= totalValue && totalValue > 0) {
								navigation.navigate("CheckOut", {
									orderProductList: orderProductList,
									Subtotal: Subtotal,
									Tax: Tax,
									totalValue: totalValue,
									cashTendered: parseInt(cashTendered),
								});
								Tax = 0;
								Subtotal = 0;
								setTotalValue(0);
								deductItems(orderProductList);
								SetOrderProductList([]);
							} else {
								if (totalValue > 0) {
									Alert.alert("Not enough cash!");
								} else {
									Alert.alert("No products in cart!");
								}
							}
						}}
					>
						<Text
							style={{
								textAlign: "center",
								fontWeight: "bold",
								fontSize: 16,
							}}
						>
							CHECKOUT
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	return (
		<View>
			<FlatList
				data={orderProductList}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => (
					<CartComponent
						name={item.productName}
						imageURI={item.imageURI}
						quantity={item.quantity}
						sellingPrice={item.sellingPrice}
						size={item.size}
						vat={item.vat}
						RemoveProductFromList={RemoveProductFromList}
					/>
				)}
				ListHeaderComponent={GetHeader}
				ListFooterComponent={GetFooter}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	bottomText: {
		fontSize: 20,
		fontWeight: "bold",
	},
});

export default Cart;
