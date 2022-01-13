import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, ScrollView } from "react-native";

import {
	collection,
	doc,
	onSnapshot,
	getDoc,
	increment,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase-config";

function Test(props) {
	const [ingredients, SetIngredients] = useState([]);
	const [products, SetProducts] = useState([]);

	//Database references
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
				}
			});
		};

		getIngredients();

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
				}
			});
		};

		getProducts();

		return () => {
			isMounted = false;
		};
	}, []);

	//For example, deduct ingredients of carbonara

	const deductItems = async (name, orderQuantity, size) => {
		//note: products should be passed as a parameter or declared to whichever screen
		//this function is in.

		//Sizes are "small", "medium", "large"

		if (typeof name != "undefined" && typeof orderQuantity != "undefined") {
			//In the list of products, find the product matching "name"
			const myProduct = products.find((product) => {
				return product.product_name.toLowerCase().includes(name.toLowerCase());
			});

			//Check if product is not drink (to not use size)
			if (myProduct.product_category != "Drinks") {
				//On each ingredient in the recipe, do stuff
				myProduct.recipe.map(async (ingredient) => {
					//access ingredient document from firebase and deduct amount
					const docRef = doc(db, "ingredients", ingredient.name);

					//update document and deduct the amount
					await updateDoc(docRef, {
						ingredient_stock: increment(-ingredient.amount * orderQuantity),
					});
				});
			} else {
				if (typeof size != "undefined") {
					myProduct.recipe.map((recipe) => {
						if (size.toLowerCase() === recipe.size) {
							recipe.ingredients.map(async (ingredient) => {
								//access ingredient document from firebase and deduct amount
								const docRef = doc(db, "ingredients", ingredient.name);

								//update document and deduct the amount
								await updateDoc(docRef, {
									ingredient_stock: increment(
										-ingredient.amount * orderQuantity
									),
								});
							});
						}
					});
				}
			}
			//reduce quantity of product by orderQuantity
			//access product document from firebase and deduct amount
			const docRef = doc(db, "products", myProduct.product_name);

			//update document and deduct the amount
			await updateDoc(docRef, {
				product_quantity: increment(-orderQuantity),
			});
		}
	};

	return (
		<View style={styles.container}>
			<Button
				title="DEDUCT INGREDIENTS FROM INVENTORY"
				onPress={() => {
					deductItems("Carbonara", 1, "medium");
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
	},
});

export default Test;
