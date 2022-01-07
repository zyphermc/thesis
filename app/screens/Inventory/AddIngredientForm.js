import React from "react";
import {
	StyleSheet,
	Button,
	TextInput,
	View,
	Text,
	TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";

function AddIngredientForm(props) {
	const initialValues = {
		name: "",
		category: "",
		quantity: "",
		price: "",
		unitOfMeasurement: "",
		imageURI: "",
		safetyStock: "",
		demandDuringLead: "",
		annualDemand: "",
		annualHoldingCost: "",
		annualOrderCost: "",
	};

	const AddToFirestore = async (data) => {
		await setDoc(
			doc(db, "ingredients", data.name),
			{
				ingredient_name: data.name,
				ingredient_category: data.category,
				ingredient_stock: parseInt(data.quantity),
				ingredient_unitPrice_avg: parseInt(data.price),
				unit_of_measurement: data.unitOfMeasurement,
				imageURI: data.imageURI,
				safety_stock: parseInt(data.safetyStock),
				demand_during_lead: parseInt(data.demandDuringLead),
				annual_demand: parseInt(data.annualDemand),
				annual_holding_cost: parseInt(data.annualHoldingCost),
				annual_order_cost: parseInt(data.annualOrderCost),
			},
			{ merge: true }
		);
	};

	return (
		<View style={styles.container}>
			<Formik
				initialValues={initialValues}
				onSubmit={(values, { resetForm }) => {
					console.log(values);
					AddToFirestore(values);
					resetForm({ values: initialValues });
				}}
			>
				{(props) => (
					<View>
						<TextInput
							style={styles.input}
							placeholder="Ingredient Name"
							onChangeText={props.handleChange("name")}
							value={props.values.name}
						/>
						<TextInput
							style={styles.input}
							placeholder="Category"
							onChangeText={props.handleChange("category")}
							value={props.values.category}
						/>
						<TextInput
							style={styles.input}
							placeholder="Quantity"
							onChangeText={props.handleChange("quantity")}
							value={props.values.quantity}
							keyboardType="numeric"
						/>
						<TextInput
							style={styles.input}
							placeholder="Unit of Measurement"
							onChangeText={props.handleChange("unitOfMeasurement")}
							value={props.values.unitOfMeasurement}
						/>
						<TextInput
							style={styles.input}
							placeholder="Initial Buying Price in ₱"
							onChangeText={props.handleChange("price")}
							value={props.values.price}
							keyboardType="numeric"
						/>
						<TextInput
							style={styles.input}
							placeholder="Safety Stock"
							onChangeText={props.handleChange("safetyStock")}
							value={props.values.safetyStock}
							keyboardType="numeric"
						/>
						<TextInput
							style={styles.input}
							placeholder="Demand during lead time"
							onChangeText={props.handleChange("demandDuringLead")}
							value={props.values.demandDuringLead}
							keyboardType="numeric"
						/>
						<TextInput
							style={styles.input}
							placeholder="Annual Demand"
							onChangeText={props.handleChange("annualDemand")}
							value={props.values.annualDemand}
							keyboardType="numeric"
						/>
						<TextInput
							style={styles.input}
							placeholder="Annual Holding Cost in ₱"
							onChangeText={props.handleChange("annualHoldingCost")}
							value={props.values.annualHoldingCost}
							keyboardType="numeric"
						/>
						<TextInput
							style={styles.input}
							placeholder="Annual Ordering Cost in ₱ (e.g. shipping fee, supplier fees, etc.)"
							onChangeText={props.handleChange("annualOrderCost")}
							value={props.values.annualOrderCost}
							keyboardType="numeric"
						/>
						<TextInput
							style={styles.input}
							placeholder="Image Link"
							onChangeText={props.handleChange("imageURI")}
							value={props.values.imageURI}
						/>

						<TouchableOpacity
							onPress={() => {
								props.handleSubmit();
							}}
							style={styles.button}
						>
							<Text style={{ fontSize: 18, color: "white" }}>Submit</Text>
						</TouchableOpacity>
					</View>
				)}
			</Formik>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 5,
	},
	input: {
		width: "100%",
		height: 50,
		borderWidth: 1,
		borderColor: "#ddd",
		padding: 10,
		fontSize: 18,
		borderRadius: 8,
	},
	button: {
		width: "100%",
		height: 60,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#67BA64",
		borderRadius: 8,
	},
});

export default AddIngredientForm;
