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
	};

	const AddToFirestore = async (data) => {
		await setDoc(
			doc(db, "ingredients", data.name),
			{
				ingredient_name: data.name,
				ingredient_category: data.category,
				ingredient_stock: data.quantity,
				ingredient_unitPrice_avg: data.price,
				unit_of_measurement: data.unitOfMeasurement,
				imageURI: data.imageURI,
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
							placeholder="Price"
							onChangeText={props.handleChange("price")}
							value={props.values.price}
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
