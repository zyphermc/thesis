import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	Alert,
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

function Cart(props) {
	const [orderProductList, SetOrderProductList] = useState(
		props.route.params.orderProductList
	);
	const [products, SetProducts] = useState([]);
	const [totalValue, setTotalValue] = useState(0);

	//Database references
	const productsCollectionRef = collection(db, "products");

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
		const GetProducts = async () => {
			const myProducts = [];
			const querySnapshot = await getDocs(productsCollectionRef);

			querySnapshot.forEach((doc) => {
				myProducts.push(doc.data());
			});

			SetProducts(myProducts);
		};

		GetProducts();

		getTotalValue();
	}, []);

	const deductItems = async (name, orderQuantity, size, price) => {
		//note: products should be passed as a parameter or declared to whichever screen
		//this function is in.

		//Sizes are "small", "medium", "large"

		if (typeof name != "undefined" && typeof orderQuantity != "undefined") {
			//In the list of products, find the product matching "name"
			const myProduct = products.find((product) => {
				return product.product_name.toLowerCase().includes(name.toLowerCase());
			});

			//Log each ordered item in products
			const prodDocRef = doc(db, "products", name);
			const prodDocSnap = await getDoc(prodDocRef);

			let productHistory = prodDocSnap.data().history;

			let orderLog = {
				type: "",
				name: "",
				amount: "",
				date: "",
				totalValue: "",
			};

			orderLog.type = "Ordered";
			orderLog.name = name;
			orderLog.amount = parseInt(orderQuantity);
			orderLog.date = currentDate;
			orderLog.totalValue = price * orderQuantity;

			productHistory.push(orderLog);

			//update product history
			await updateDoc(prodDocRef, {
				product_quantity: increment(-orderQuantity),
				history: productHistory,
			});

			//Check if product is not drink (to not use size)
			if (myProduct.product_category != "Drinks") {
				//On each ingredient in the recipe, do stuff
				myProduct.recipe.map(async (ingredient) => {
					//access ingredient document from firebase and deduct amount
					const docRef = doc(db, "ingredients", ingredient.name);

					const foodDocSnap = await getDoc(docRef);

					let foodHistory = foodDocSnap.data().history;

					let foodLog = {
						type: "",
						name: "",
						amount: "",
						date: "",
					};

					foodLog.type = "Deducted";
					foodLog.name = name;
					foodLog.amount = ingredient.amount * orderQuantity;
					foodLog.date = currentDate;

					foodHistory.push(foodLog);

					//update document and deduct the amount
					await updateDoc(docRef, {
						ingredient_stock: increment(-ingredient.amount * orderQuantity),
						history: foodHistory,
					});
				});
			} else {
				if (typeof size != "undefined") {
					myProduct.recipe.map((recipe) => {
						if (size.toLowerCase() === recipe.size) {
							recipe.ingredients.map(async (ingredient) => {
								//access ingredient document from firebase and deduct amount
								const docRef = doc(db, "ingredients", ingredient.name);

								const drinkDocSnap = await getDoc(docRef);

								let drinkHistory = drinkDocSnap.data().history;

								let drinkLog = {
									type: "",
									name: "",
									amount: "",
									date: "",
								};

								drinkLog.type = "Deducted";
								drinkLog.name = name;
								drinkLog.amount = ingredient.amount * orderQuantity;
								drinkLog.date = currentDate;

								drinkHistory.push(drinkLog);

								//update document and deduct the amount
								await updateDoc(docRef, {
									ingredient_stock: increment(
										-ingredient.amount * orderQuantity
									),
									history: drinkHistory,
								});
							});
						}
					});
				}
			}
		}
	};

	const UpdateTransactionLog = () => {
		//Deduct Items and Update Transaction
		orderProductList.forEach((order) => {
			if (order.quantity > 0) {
				deductItems(
					order.productName,
					order.quantity,
					order.size,
					order.sellingPrice
				);
			}
		});
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
								SetOrderProductList([]);
								UpdateTransactionLog();
							} else {
								if (totalValue > 0) {
									Alert.alert("Not enough cash!");
								} else {
									Alert.alert("No products in cart!");
								}
								console.log(orderProductList);
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
