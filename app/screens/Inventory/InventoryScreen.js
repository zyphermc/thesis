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
	doc,
	deleteDoc,
	onSnapshot,
} from "firebase/firestore";

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

	let child_id = 1;

	function getImageIndex(imgName) {
		return ingredientImageArr.findIndex((obj) => obj.name === imgName);
	}

	//Ingredients and Products Firebase reference
	const ingredientsCollectionRef = collection(db, "ingredients");
	const productsCollectionRef = collection(db, "products");

	useEffect(() => {
		//Get Ingredients from Firestore
		const getIngredients = async () => {
			const unsub = onSnapshot(ingredientsCollectionRef, (docsSnapshot) => {
				const myIngredients = [];

				docsSnapshot.forEach((doc) => {
					myIngredients.push(doc.data());
				});

				SetIngredients(myIngredients);
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

				SetProducts(myProducts);
			});
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
								key={++child_id}
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
									key={++child_id}
									style={{
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "flex-start",
									}}
								>
									<Image
										key={++child_id}
										source={{ uri: ingredient.imageURI }}
										style={{
											width: 100,
											height: 100,
										}}
									/>
									<View
										key={++child_id}
										style={{
											marginLeft: 10,
										}}
									>
										<Text key={++child_id} style={{ fontWeight: "bold" }}>
											Name: {ingredient.ingredient_name}
										</Text>
										<Text key={++child_id}>
											Category: {ingredient.ingredient_category}
										</Text>
										<Text key={++child_id}>
											Quantity: {ingredient.ingredient_stock}{" "}
											{ingredient.unit_of_measurement}
										</Text>
										<Text key={++child_id}>
											Stock Level: <Text style={{ color: "green" }}>GOOD</Text>
										</Text>
									</View>
								</View>

								<View
									key={++child_id}
									style={{
										position: "absolute",
										top: 10,
										right: 10,
									}}
								>
									<TouchableOpacity
										key={++child_id}
										style={styles.buttonInside}
										onPress={handleButtonView}
									>
										<Ionicons
											key={++child_id}
											name="clipboard-outline"
											size={22}
											color={"white"}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										key={++child_id}
										style={[styles.buttonInside, { backgroundColor: "red" }]}
										onPress={() => {
											handleButtonDelete(ingredient.ingredient_name);
										}}
									>
										<Ionicons
											key={++child_id}
											name="trash-outline"
											size={22}
											color={"white"}
										/>
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
