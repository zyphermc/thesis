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

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

import { db } from "../../../firebase-config";
//Import Ingredient List Item component
import PosComponent from "../../components/PosComponent";

function OrderScreen({ route }) {
	const [products, SetProducts] = useState([]);
	const [filteredProducts, SetFilteredProducts] = useState([]);

	//Viewing Product or Ingredient State
	const [isLoading, SetIsLoading] = useState(true);

	//Ingredients and Products Firebase reference
	const productsCollectionRef = collection(db, "products");

	const navigation = useNavigation();

	useEffect(() => {
		let isMounted = true;
		SetIsLoading(true);

		//Get Products from Firestore
		const getProducts = async () => {
			const unsub = onSnapshot(productsCollectionRef, (docsSnapshot) => {
				const myProducts = [];

				docsSnapshot.docChanges().forEach(async (change) => {
					if (change.type === "added" || change.type === "modified") {
						//If there is a document added or modified,
						//do stuff here
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

	const handleButtonAdd = () => {
		//add to cart
	};

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
							sellingPrice={item.product_sellingPrice}
							selling_prices={item.selling_prices}
							imageURI={item.product_imageURI}
							handleButtonAdd={handleButtonAdd}
							getOrderedProduct={getOrderedProduct}
							vat={item.product_vatPercent}
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
