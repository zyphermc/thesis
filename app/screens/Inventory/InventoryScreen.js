import React from "react";
import { Text, StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
	collection,
	getDocs,
	doc,
	setDoc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore/lite";

import { db } from "../../../firebase-config";

function InventoryScreen({ route }) {
	const isAdmin = route.params.isAdmin;

	const SetData = async () => {
		// Add a new document in collection "products"
		await setDoc(doc(db, "products", "French Fries"), {
			product_name: "Belgian Chocolate",
			amount: 69,
		});
	};

	const UpdateData = async () => {
		//test variable
		const frenchFriesRef = doc(db, "products", "French Fries");

		//Update an existing document in collection
		await updateDoc(frenchFriesRef, {
			product_name: "French Fries",
		});
	};

	const DeleteData = async () => {
		//test data
		const frenchFriesRef = doc(db, "products", "French Fries");

		//Delete a document
		await deleteDoc(frenchFriesRef);
	};

	//Retrieve Data from Firestore
	const GetData = async () => {
		const productsCol = collection(db, "products");
		const productsSnapshot = await getDocs(productsCol);

		console.log(productsSnapshot.docs.map((doc) => doc.data()));
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={{ alignSelf: "center" }}>
				My Inventory: {isAdmin ? "is admin" : "is not admin"}
			</Text>
			<Button style={styles.btn} title={"Set Data"} onPress={SetData} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
});

export default InventoryScreen;
