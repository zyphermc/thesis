import React, { useState, useEffect } from "react";
import {
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
	TextInput,
	Modal,
} from "react-native";

import { collection, doc, deleteDoc, onSnapshot } from "firebase/firestore";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

import { db } from "../../../firebase-config";

//Import Modals
import AddIngredientModal from "./AddIngredientModal";
import AddProductModal from "./AddProductModal";

//Import Ingredient List Item component
import IngredientItemComponent from "../../components/IngredientItemComponent";

function InventoryScreen({ route }) {
	const [isAdmin] = useState(route.params.isAdmin);

	const [ingredients, SetIngredients] = useState([]);
	const [filteredIngredients, SetFilteredIngredients] = useState([]);

	const [products, SetProducts] = useState([]);
	const [filteredProducts, SetFilteredProducts] = useState([]);

	//Viewing Product or Ingredient State
	const [isViewing, SetIsViewing] = useState("Ingredients"); //Set state to "Products" when toggled by something

	const [modalOpen, SetModalOpen] = useState(false);

	//Ingredients and Products Firebase reference
	const ingredientsCollectionRef = collection(db, "ingredients");
	const productsCollectionRef = collection(db, "products");

	useEffect(() => {
		let isMounted = true;

		//Get Ingredients from Firestore
		const getIngredients = async () => {
			const unsub = onSnapshot(ingredientsCollectionRef, (docsSnapshot) => {
				const myIngredients = [];

				docsSnapshot.forEach((doc) => {
					myIngredients.push(doc.data());
				});

				if (isMounted) {
					SetIngredients(myIngredients);
					SetFilteredIngredients(myIngredients);
				}
			});
		};

		getIngredients();

		//Get Products from Firestore
		const getProducts = async () => {
			const unsub = onSnapshot(productsCollectionRef, (docsSnapshot) => {
				const myProducts = [];

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

		return () => {
			isMounted = false;
		};
	}, []);

	const handleButtonView = () => {
		//show detailed view about product
	};

	const handleButtonDelete = async (name) => {
		//show confirmation message then
		//delete document from database
		await deleteDoc(doc(db, "ingredients", name));
	};

	const handleOpenModal = () => {
		//open add ingredient modal
		SetModalOpen(true);
	};

	const SearchNameIngredient = (input) => {
		const data = ingredients;

		const searchData = data.filter((item) => {
			return (
				item.ingredient_name.toLowerCase().includes(input.toLowerCase()) ||
				item.ingredient_category.toLowerCase().includes(input.toLowerCase()) ||
				item.stock_status.toLowerCase().includes(input.toLowerCase())
			);
		});

		SetFilteredIngredients(searchData);
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

	return (
		<View style={styles.container}>
			<Modal visible={modalOpen} animationType="slide">
				{isViewing == "Ingredients" ? (
					<AddIngredientModal
						closeModal={() => {
							SetModalOpen(false);
						}}
					/>
				) : (
					<AddProductModal
						closeModal={() => {
							SetModalOpen(false);
						}}
					/>
				)}
			</Modal>

			<View>
				<TextInput
					style={styles.searchBar}
					placeholder={
						isViewing == "Ingredients"
							? "Search ingredient..."
							: "Search products..."
					}
					onChangeText={(input) => {
						if (isViewing == "Ingredients") {
							SearchNameIngredient(input);
						} else {
							SearchNameProduct(input);
						}
					}}
				/>
				<TouchableOpacity
					style={styles.addItemButtonContainer}
					onPress={handleOpenModal}
				>
					<Ionicons name="add-outline" size={22} color={"white"} />
					<Text style={{ color: "white", marginRight: 8 }}>
						{isViewing == "Ingredients" ? "Add Ingredient" : "Add Product"}
					</Text>
				</TouchableOpacity>
			</View>

			<FlatList
				data={filteredIngredients}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => (
					<IngredientItemComponent
						name={item.ingredient_name}
						category={item.ingredient_category}
						quantity={item.ingredient_stock}
						unit_of_measurement={item.unit_of_measurement}
						imageURI={item.imageURI}
						stock_status={item.stock_status}
						handleButtonView={handleButtonView}
						handleButtonDelete={handleButtonDelete}
					/>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 5,
	},
	addItemButtonContainer: {
		alignSelf: "flex-end",
		alignItems: "center",
		backgroundColor: "#67BA64",
		marginRight: 5,
		flexDirection: "row",
		padding: 4,
		borderWidth: 1,
		borderRadius: 12,
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

export default InventoryScreen;
