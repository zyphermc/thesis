import React from "react";
import {
	StyleSheet,
	TextInput,
	View,
	Text,
	TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase-config";

function AddProductForm(props) {
	const initialValues = {
		name: "",
		category: "",
		description: "",
		quantity: "", //to be removed, going to be automatically calculated based on recipe
		price: "",
		vatPercent: "",
		imageURI: "",
		//Add recipe here
	};

	const AddToFirestore = async (data) => {
		await setDoc(
			doc(db, "products", data.name),
			{
				product_name: data.name,
				product_category: data.category,
				product_description: data.description,
				product_quantity: parseInt(data.quantity),
				product_sellingPrice: parseInt(data.price),
				product_vatPercent: parseInt(data.vatPercent),
				product_imageURI: data.imageURI,
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
							placeholder="Product Name"
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
							placeholder="Description"
							onChangeText={props.handleChange("description")}
							value={props.values.description}
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
							placeholder="Selling Price in ₱"
							onChangeText={props.handleChange("price")}
							value={props.values.price}
							keyboardType="numeric"
						/>
						<TextInput
							style={styles.input}
							placeholder="VAT %"
							onChangeText={props.handleChange("vatPercent")}
							value={props.values.vatPercent}
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

export default AddProductForm;
