import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
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
} from "react-native";

import {
	collection,
	doc,
	deleteDoc,
	onSnapshot,
	updateDoc,
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

	const CalculateProductMaxQuantity = async (name) => {
		if (products.length > 0 && ingredients.length > 0) {
			const product = products.find((item) => {
				return item.product_name === name;
			});

			if (product.product_category == "Food") {
				let product_quantities = [];
				let availableQuantity = 0;

				product.recipe.map((ingredient) => {
					const dbIngredient = ingredients.find((item) => {
						return item.ingredient_name === ingredient.name;
					});

					let tempQuantity = Math.floor(
						dbIngredient.ingredient_stock / ingredient.amount
					);

					product_quantities.push(tempQuantity);
				});

				availableQuantity = Math.min(...product_quantities);

				try {
					await updateDoc(doc(db, "products", product.product_name), {
						product_quantity: availableQuantity,
					});
				} catch (err) {
					console.log(err);
				}
			} else {
				let availableQuantities = product.product_quantities;

				product.product_quantities.map(async (quantity, index) => {
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

				try {
					await updateDoc(doc(db, "products", product.product_name), {
						product_quantities: availableQuantities,
					});
				} catch (err) {
					console.log(err);
				}
			}
		}
	};

	useEffect(() => {
		let isMounted = true;
		SetIsLoading(true);

		//Get Ingredients from Firestore
		const getIngredients = async () => {
			const unsub = onSnapshot(ingredientsCollectionRef, (docsSnapshot) => {
				const myIngredients = [];

				docsSnapshot.docChanges().forEach(async (change) => {
					if (change.type === "added" || change.type === "modified") {
						//Functions here
					}
				});

				docsSnapshot.forEach((doc) => {
					myIngredients.push(doc.data());
				});

				if (isMounted) {
					//Update Ingredient State with latest data
					SetIngredients(myIngredients);
				}
			});
		};

		getIngredients();

		//Get Products from Firestore
		const getProducts = async () => {
			const unsub = onSnapshot(productsCollectionRef, (docsSnapshot) => {
				const myProducts = [];

				docsSnapshot.docChanges().forEach(async (change) => {
					if (change.type === "added" || change.type === "modified") {
						//Put functions here
					}
				});

				docsSnapshot.forEach((doc) => {
					myProducts.push(doc.data());
				});

				if (isMounted) {
					SetProducts(myProducts);
					SetFilteredProducts(myProducts);
				}
			});
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

	let orderProductList = [];

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
			orderProductList[orderIndex].quantity += quantity;
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
				orderProductList.push(OrderedProduct);
			}
		}
	};

	const ClearCart = () => {
		orderProductList = [];
		showMessage({
			message: "Cart cleared successfully!",
			type: "success",
		});
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
							quantity={item.product_quantity}
							quantities={item.product_quantities}
							sellingPrice={item.product_sellingPrice}
							selling_prices={item.selling_prices}
							imageURI={item.product_imageURI}
							getOrderedProduct={getOrderedProduct}
							vat={item.product_vatPercent}
							GetOrderProductList={GetOrderProductList}
							CalculateProductMaxQuantity={CalculateProductMaxQuantity}
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
