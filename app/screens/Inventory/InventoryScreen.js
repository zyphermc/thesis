import React, { useState, useEffect } from "react";
import {
	Text,
	StyleSheet,
	Button,
	View,
	TouchableOpacity,
	Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
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

import { db } from "../../../firebase-config";

function InventoryScreen({ navigation, route }) {
	const [isAdmin] = useState(route.params.isAdmin);
	const [ingredients, SetIngredients] = useState([]);
	const [products, SetProducts] = useState([]);

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

	const handleButtonDelete = () => {
		//show confirmation message then
		//delete document from database
	};

	const handleAddIngredient = () => {
		//show add ingredient window
		//add ingredient to database
	};

	return (
		<>
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
									source={{ uri: "https://picsum.photos/100" }}
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
									style={styles.buttonView}
									onPress={handleButtonView}
								>
									<Ionicons
										name="clipboard-outline"
										size={22}
										color={"white"}
									/>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.buttonDelete}
									onPress={handleButtonDelete}
								>
									<Ionicons name="trash-outline" size={22} color={"white"} />
								</TouchableOpacity>
							</View>
						</View>
					);
				})}
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
	buttonView: {
		width: 50,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#67BA64",
		marginBottom: 5,
		borderWidth: 1,
		borderRadius: 6,
	},
	buttonDelete: {
		width: 50,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "red",
		marginBottom: 5,
		borderWidth: 1,
		borderRadius: 6,
	},
});

export default InventoryScreen;
