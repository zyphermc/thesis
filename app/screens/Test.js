import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase-config";

function Test(props) {
	const [ingredients, SetIngredients] = useState([]);
	const ingredientsCollectionRef = collection(db, "ingredients");
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

		return () => {
			isMounted = false;
		};
	}, []);

	const CalculateROP = (safetyStock, demandDuringLead) => {
		const ROP = safetyStock + demandDuringLead;

		console.log(ROP);
	};

	const CalculateOrderSize = (
		annualDemand,
		annualHoldingCost,
		annualOrderCost
	) => {
		//enter calculation hereeeee
		const EOQ = Math.sqrt(
			(2 * annualDemand * annualOrderCost) / annualHoldingCost
		);
		console.log(EOQ);
	};

	return (
		<View style={styles.container}>
			<Text>Hello World</Text>
			<Button
				title="CALCULATE ROP"
				onPress={() => {
					CalculateROP(100, 200);
				}}
			/>
			<Button
				title="CALCULATE EOQ"
				onPress={() => {
					CalculateOrderSize(73000, 100, 1000);
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
