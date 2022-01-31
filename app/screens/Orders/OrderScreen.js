import React, { useState, useEffect } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
	TextInput,
	Modal,
	ActivityIndicator,
	ImageBackground,
	DeviceEventEmitter,
} from "react-native";

import {
	collection,
	doc,
	deleteDoc,
	onSnapshot,
	updateDoc,
	getDocs,
} from "firebase/firestore";

import { showMessage } from "react-native-flash-message";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

import { db } from "../../../firebase-config";
//Import Ingredient List Item component
import PosComponent from "../../components/PosComponent";

function OrderScreen({ route }) {
	//Viewing Product or Ingredient State
	const [isLoading, SetIsLoading] = useState(true);

	//Ingredients and Products Firebase reference
	const ingredientsCollectionRef = collection(db, "ingredients");
	const productsCollectionRef = collection(db, "products");

	const [products, SetProducts] = useState([]);
	const [ingredients, SetIngredients] = useState([]);
	const [filteredProducts, SetFilteredProducts] = useState([]);

	const navigation = useNavigation();

	let persistentProducts = [];
	let persistentIngredients = [];

	const deductItemsLocally = (name, category, recipe, orderQuantity, size) => {
		if (typeof name != "undefined" && typeof orderQuantity != "undefined") {
			//Check if product is not drink (to not use size)
			if (category != "Drinks") {
				//On each ingredient in the recipe, do stuff
				recipe.map(async (ingredient) => {
					const myIngredients = ingredients;

					const myIngredient = myIngredients.find((item) => {
						return item.ingredient_name === ingredient.name;
					});

					//deduct the amount
					myIngredient.ingredient_stock -= orderQuantity * ingredient.amount;

					SetIngredients(myIngredients);
				});
			} else {
				if (size != "") {
					recipe.map((recipe) => {
						if (size.toLowerCase() === recipe.size) {
							recipe.ingredients.map(async (ingredient) => {
								const myIngredients = ingredients;

								const myIngredient = ingredients.find((item) => {
									return item.ingredient_name === ingredient.name;
								});

								//deduct the amount
								myIngredient.ingredient_stock -=
									orderQuantity * ingredient.amount;

								SetIngredients(myIngredients);
							});
						}
					});
				}
			}
		}
	};

	const addItemsLocally = (data) => {
		let name = data.data[0];
		let orderQuantity = data.data[1];
		let size = data.data[2];

		if (
			typeof name != "undefined" &&
			typeof orderQuantity != "undefined" &&
			persistentProducts.length > 0
		) {
			let category = persistentProducts.find((item) => {
				return item.product_name == name;
			}).product_category;
			let recipe = persistentProducts.find((item) => {
				return item.product_name == name;
			}).recipe;

			//Check if product is not drink (to not use size)
			if (category != "Drinks") {
				//On each ingredient in the recipe, do stuff
				recipe.map(async (ingredient) => {
					const myIngredients = persistentIngredients;

					const myIngredient = myIngredients.find((item) => {
						return item.ingredient_name === ingredient.name;
					});

					//add the amount
					myIngredient.ingredient_stock += orderQuantity * ingredient.amount;

					SetIngredients(myIngredients);
				});
			} else {
				if (typeof size != "undefined" && persistentProducts.length > 0) {
					recipe.map((recipe) => {
						if (size.toLowerCase() === recipe.size) {
							recipe.ingredients.map(async (ingredient) => {
								const myIngredients = persistentIngredients;

								const myIngredient = persistentIngredients.find((item) => {
									return item.ingredient_name === ingredient.name;
								});

								//add the amount
								myIngredient.ingredient_stock +=
									orderQuantity * ingredient.amount;

								SetIngredients(myIngredients);
							});
						}
					});
				}
			}
		}
	};

	const addItemsOnClear = (orderList) => {
		orderList.forEach((order) => {
			let name = order.productName;
			let orderQuantity = order.quantity;
			let size = order.size;

			persistentProducts = products;
			persistentIngredients = ingredients;

			if (
				typeof name != "undefined" &&
				typeof orderQuantity != "undefined" &&
				persistentProducts.length > 0
			) {
				let category = persistentProducts.find((item) => {
					return item.product_name == name;
				}).product_category;
				let recipe = persistentProducts.find((item) => {
					return item.product_name == name;
				}).recipe;

				//Check if product is not drink (to not use size)
				if (category != "Drinks") {
					//On each ingredient in the recipe, do stuff
					recipe.map(async (ingredient) => {
						const myIngredients = persistentIngredients;

						const myIngredient = myIngredients.find((item) => {
							return item.ingredient_name === ingredient.name;
						});

						//add the amount
						myIngredient.ingredient_stock += orderQuantity * ingredient.amount;

						SetIngredients(myIngredients);
					});
				} else {
					if (typeof size != "undefined" && persistentProducts.length > 0) {
						recipe.map((recipe) => {
							if (size.toLowerCase() === recipe.size) {
								recipe.ingredients.map(async (ingredient) => {
									const myIngredients = persistentIngredients;

									const myIngredient = persistentIngredients.find((item) => {
										return item.ingredient_name === ingredient.name;
									});

									//add the amount
									myIngredient.ingredient_stock +=
										orderQuantity * ingredient.amount;

									SetIngredients(myIngredients);
								});
							}
						});
					}
				}
			}
		});
	};

	const deployListener = () => {
		DeviceEventEmitter.addListener("addItemsLocally", (data) =>
			addItemsLocally(data)
		);
		DeviceEventEmitter.addListener("ClearCartGlobal", () => ClearCartGlobal());
	};

	useEffect(() => {
		let isMounted = true;
		SetIsLoading(true);
		deployListener();

		//Get Ingredients from Firestore
		const getIngredients = async () => {
			const docsSnapshot = await getDocs(ingredientsCollectionRef);
			const myIngredients = [];

			docsSnapshot.forEach((doc) => {
				myIngredients.push(doc.data());
			});

			if (isMounted) {
				//Update Ingredient State with latest data
				persistentIngredients = myIngredients;
				SetIngredients(myIngredients);
			}
		};

		getIngredients();

		//Get Products from Firestore
		const getProducts = async () => {
			const docsSnapshot = await getDocs(productsCollectionRef);

			const myProducts = [];

			docsSnapshot.forEach((doc) => {
				myProducts.push(doc.data());
			});

			if (isMounted) {
				persistentProducts = myProducts;
				SetProducts(myProducts);
				SetFilteredProducts(myProducts);
			}
		};

		getProducts();

		SetIsLoading(false);
		return () => {
			isMounted = false;
		};
	}, []);

	const SearchNameProduct = (input) => {
		const data = products;

		const searchData = data.filter((item) => {
			return (
				item.product_name.toLowerCase().includes(input.toLowerCase()) ||
				item.product_category.toLowerCase().includes(input.toLowerCase())
			);
		});

		SetFilteredProducts(searchData);
	};

	const GetOrderProductList = () => {
		return orderProductList;
	};

	const [orderProductList, SetOrderProductList] = useState([]);

	let OrderedProduct = {
		productName: "",
		quantity: "",
		sellingPrice: "",
		vat: "",
		imageURI: "",
		size: "",
	};

	const getOrderedProduct = (
		productName,
		quantity,
		sellingPrice,
		vat,
		imageURI,
		size
	) => {
		const orderIndex = orderProductList.findIndex((order) => {
			return (
				order.productName.includes(productName) && order.size.includes(size)
			);
		});
		if (orderIndex != -1) {
			let tempOrderProductList = orderProductList;

			tempOrderProductList[orderIndex].quantity += quantity;

			SetOrderProductList(tempOrderProductList);
		} else {
			if (quantity > 0) {
				OrderedProduct = {
					productName: productName,
					quantity: quantity,
					sellingPrice: sellingPrice,
					vat: vat,
					imageURI: imageURI,
					size: size,
				};
				let tempOrderProductList = orderProductList;

				tempOrderProductList.push(OrderedProduct);
				SetOrderProductList(tempOrderProductList);
			}
		}
	};

	const ClearCart = () => {
		if (orderProductList.length > 0) {
			addItemsOnClear(orderProductList);
			console.log("CART CLEARED");
			SetOrderProductList([]);
			showMessage({
				message: "Cart cleared successfully!",
				type: "success",
			});
		} else {
			showMessage({
				message: "Cart is already empty!",
				type: "warning",
			});
		}
	};

	const ClearCartGlobal = () => {
		SetOrderProductList([]);
	};

	function ShowProductsComponent() {
		if (isLoading) {
			return (
				<ActivityIndicator
					animating={isLoading}
					size="large"
					color="black"
					style={styles.loadingAnimation}
				/>
			);
		} else {
			return (
				<FlatList
					data={filteredProducts}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => (
						<PosComponent
							name={item.product_name}
							category={item.product_category}
							recipe={item.recipe}
							quantity={item.product_quantity}
							quantities={item.product_quantities}
							sellingPrice={item.product_sellingPrice}
							selling_prices={item.selling_prices}
							imageURI={item.product_imageURI}
							getOrderedProduct={getOrderedProduct}
							vat={item.product_vatPercent}
							GetOrderProductList={GetOrderProductList}
							ingredients={ingredients}
							deductItemsLocally={deductItemsLocally}
						/>
					)}
				/>
			);
		}
	}

	return (
		<ImageBackground
			source={{
				uri: "https://i.pinimg.com/originals/6c/59/cd/6c59cd041f58cd43c9be81cfa2546f9d.jpg",
			}}
			resizeMode="cover"
			style={styles.container}
		>
			<View style={{ marginHorizontal: 5 }}>
				<View>
					<TextInput
						style={styles.searchBar}
						placeholder={"Search products..."}
						onChangeText={(input) => {
							SearchNameProduct(input);
						}}
					/>
					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}
					>
						<TouchableOpacity
							style={styles.addItemButtonContainer}
							onPress={() => {
								navigation.navigate("Tab", {
									products: products,
									ingredients: ingredients,
									orderProductList: orderProductList,
								});
							}}
						>
							<Ionicons name="add-outline" size={22} color={"white"} />
							<Text style={{ color: "white" }}>Checkout</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.addItemButtonContainer}
							onPress={() => {
								ClearCart();
							}}
						>
							<Text style={{ color: "white" }}>Clear Cart</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<ShowProductsComponent />
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#8966F8",
	},
	addItemButtonContainer: {
		flex: 0.4,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#67BA64",
		margin: 3,
		flexDirection: "row",
		padding: 4,
		borderWidth: 1,
		borderRadius: 12,
	},
	switchViewButtonContainer: {
		flex: 0.4,
		justifyContent: "center",
		alignItems: "center",
		margin: 3,
		flexDirection: "row",
		padding: 4,
		borderWidth: 1,
		borderRadius: 12,
	},
	loadingAnimation: {
		justifyContent: "center",
		alignSelf: "center",
	},
	searchBar: {
		width: "100%",
		height: 40,
		justifyContent: "center",
		backgroundColor: "#C0C0C0",
		borderRadius: 6,
		marginTop: 5,
		paddingHorizontal: 5,
	},
});

export default OrderScreen;
