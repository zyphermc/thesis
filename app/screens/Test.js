import React, { useEffect, useState } from "react";
import { LogBox, ScrollView, Text, View } from "react-native";
import { collection, getDocs, onSnapshot, doc } from "firebase/firestore";
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
			const unsub = onSnapshot(ingredientsCollectionRef, (docsSnapshot) => {
				const myIngredients = [];

				docsSnapshot.forEach((doc) => {
					myIngredients.push(doc.data());
				});

				SetIngredients(myIngredients);
			});
		};

		getIngredients();
	}, []);

	return (
		<ScrollView>
			{ingredients.map((ingredient) => {
				return (
					<View style={{ paddingBottom: 100 }} key={ingredient.ingredient_name}>
						<Text>Name: {ingredient.ingredient_name}</Text>
						<Text>Category: {ingredient.ingredient_category}</Text>
					</View>
				);
			})}
		</ScrollView>
	);
}

export default Test;
