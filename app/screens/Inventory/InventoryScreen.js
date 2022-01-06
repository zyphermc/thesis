import React, { useState, useEffect } from "react";
import {
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	Image,
	ScrollView,
	Modal,
} from "react-native";

import {
	collection,
	getDocs,
	getDoc,
	doc,
	setDoc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore/lite";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

//Import Array of Images for Ingredients
import { ingredientImageArr } from "../../assets/images/ingredients";

import { db } from "../../../firebase-config";

//Import Add Ingredient Modal
import AddIngredientModal from "./AddIngredientModal";

function InventoryScreen({ route }) {
	const [isAdmin] = useState(route.params.isAdmin);
	const [ingredients, SetIngredients] = useState([]);
	const [products, SetProducts] = useState([]);
	const [modalOpen, SetModalOpen] = useState(false);

	function getImageIndex(imgName) {
		return ingredientImageArr.findIndex((obj) => obj.name === imgName);
	}

	//Ingredients and Products Firebase reference
	const ingredientsCollectionRef = collection(db, "ingredients");
	const productsCollectionRef = collection(db, "products");

	useEffect(() => {
		//Get Ingredients from Firestore
		const getIngredients = async () => {
			const ingredientsData = await getDocs(ingredientsCollectionRef);

			SetIngredients(
				ingredientsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
			);
		};

		getIngredients();

		//Get Products from Firestore
		const getProducts = async () => {
			const productsData = await getDocs(productsCollectionRef);
			SetProducts(
				productsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
			);
		};

		getProducts();
	}, []);

	const handleButtonView = () => {
		//show detailed view about product
	};

	const handleButtonDelete = async (name) => {
		//show confirmation message then
		//delete document from database
		await deleteDoc(doc(db, "ingredients", name));
	};

	const handleAddIngredient = () => {
		//open add ingredient modal
		SetModalOpen(true);
	};

	return (
		<>
			<Modal visible={modalOpen} animationType="slide">
				<AddIngredientModal
					closeModal={() => {
						SetModalOpen(false);
					}}
				/>
			</Modal>

			<View>
				<TouchableOpacity
					style={{
						alignSelf: "flex-end",
						alignItems: "center",
						backgroundColor: "#67BA64",
						marginRight: 20,
						flexDirection: "row",
						padding: 4,
						borderWidth: 1,
						borderRadius: 12,
					}}
					onPress={handleAddIngredient}
				>
					<Ionicons name="add-outline" size={22} color={"white"} />
					<Text style={{ color: "white", marginRight: 8 }}>Add Ingredient</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.container}>
				<ScrollView>
					{ingredients.map((ingredient) => {
						return (
							<View
								key={ingredient.id}
								style={{
									width: "100%",
									height: 130,
									padding: 10,
									marginBottom: 5,
									borderWidth: 1,
									borderRadius: 5,
								}}
							>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "flex-start",
									}}
								>
									<Image
										source={ingredientImageArr[getImageIndex("Garlic")].image}
										style={{
											width: 100,
											height: 100,
										}}
									/>
									<View
										style={{
											marginLeft: 10,
										}}
									>
										<Text style={{ fontWeight: "bold" }}>
											Name: {ingredient.ingredient_name}
										</Text>
										<Text>Category: {ingredient.ingredient_category}</Text>
										<Text>
											Quantity: {ingredient.ingredient_stock}{" "}
											{ingredient.unit_of_measurement}
										</Text>
										<Text>
											Stock Level: <Text style={{ color: "green" }}>GOOD</Text>
										</Text>
									</View>
								</View>

								<View
									style={{
										position: "absolute",
										top: 10,
										right: 10,
									}}
								>
									<TouchableOpacity
										style={styles.buttonInside}
										onPress={handleButtonView}
									>
										<Ionicons
											name="clipboard-outline"
											size={22}
											color={"white"}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										style={[styles.buttonInside, { backgroundColor: "red" }]}
										onPress={() => {
											handleButtonDelete(ingredient.ingredient_name);
										}}
									>
										<Ionicons name="trash-outline" size={22} color={"white"} />
									</TouchableOpacity>
								</View>
							</View>
						);
					})}
				</ScrollView>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: 20,
		marginVertical: 10,
	},
	buttonInside: {
		width: 50,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#67BA64",
		marginBottom: 5,
		borderWidth: 1,
		borderRadius: 6,
	},
});

export default InventoryScreen;
