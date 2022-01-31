import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useFocusEffect } from "@react-navigation/native";

function HomeScreen(props) {
	//Ingredients and Products Firebase reference
	const ingredientsCollectionRef = collection(db, "ingredients");
	const productsCollectionRef = collection(db, "products");

	const [products, SetProducts] = useState([]);
	const [ingredients, SetIngredients] = useState([]);

	let ingredientsFast = [];

	// Calculate Max Quantities of Products here so that it is the first thing
	// the app does.
	const CalculateProductMaxQuantity = async (data) => {
		if (ingredientsFast.length > 0) {
			if (data.product_category == "Food") {
				let product_quantities = [];
				let availableQuantity = 0;

				data.recipe.map((ingredient) => {
					const dbIngredient = ingredientsFast.find((item) => {
						return item.ingredient_name === ingredient.name;
					});

					let tempQuantity = Math.floor(
						dbIngredient.ingredient_stock / ingredient.amount
					);

					product_quantities.push(tempQuantity);
				});

				availableQuantity = Math.min(...product_quantities);

				try {
					await updateDoc(doc(db, "products", data.product_name), {
						product_quantity: availableQuantity,
					});
				} catch (err) {
					console.log(err);
				}
			} else {
				let availableQuantities = data.product_quantities;

				data.product_quantities.map(async (quantity, index) => {
					let product_quantities = [];

					let availableQuantity = 0;

					//Get recipe according to size
					const myRecipe = data.recipe.find((item) => {
						return item.size === quantity.size;
					});

					//Iterate through each ingredient and get the max order quantity
					myRecipe.ingredients.map((ingredient) => {
						const dbIngredient = ingredientsFast.find((item) => {
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
					await updateDoc(doc(db, "products", data.product_name), {
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

		//Get Ingredients from Firestore
		const unsubIngredients = onSnapshot(
			ingredientsCollectionRef,
			(docsSnapshot) => {
				const myIngredients = [];

				docsSnapshot.docChanges().forEach(async (change) => {
					if (change.type === "added" || change.type === "modified") {
						//
					}
				});

				docsSnapshot.forEach((doc) => {
					myIngredients.push(doc.data());
				});

				if (isMounted) {
					//Update Ingredient State with latest data
					ingredientsFast = myIngredients;
					SetIngredients(myIngredients);

					products.map((item) => {
						CalculateProductMaxQuantity(item);
					});
				}
			}
		);

		//Get Products from Firestore
		const unsubProducts = onSnapshot(productsCollectionRef, (docsSnapshot) => {
			const myProducts = [];

			docsSnapshot.docChanges().forEach(async (change) => {
				if (change.type === "added" || change.type === "modified") {
					//
				}
			});

			docsSnapshot.forEach((doc) => {
				myProducts.push(doc.data());
				CalculateProductMaxQuantity(doc.data());
			});

			if (isMounted) {
				SetProducts(myProducts);
			}
		});

		return () => {
			isMounted = false;
			unsubIngredients();
			unsubProducts();
		};
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			if (products.length > 0) {
				products.map((item) => {
					CalculateProductMaxQuantity(item);
				});
			}
		}, [])
	);

	return (
		<View style={styles.container}>
			<Image
				source={require("../../assets/images/home.jpg")}
				style={{ width: "100%", height: "100%", resizeMode: "cover" }}
			></Image>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default HomeScreen;
