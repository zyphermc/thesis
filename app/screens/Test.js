import React, { useEffect, useState } from "react";
import { LogBox, ScrollView, Text, View } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase-config";

function Test(props) {
	LogBox.ignoreLogs(["Setting a timer"]);

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

	return (
		<ScrollView>
			{ingredients.map((ingredient) => {
				return (
					<View style={{ paddingBottom: 100 }}>
						<Text>Name: {ingredient.ingredient_name}</Text>
						<Text>Category: {ingredient.ingredient_category}</Text>
					</View>
				);
			})}
		</ScrollView>
	);
}

export default Test;
