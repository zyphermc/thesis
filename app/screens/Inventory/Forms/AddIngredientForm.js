import React, { useRef } from "react";
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
import FlashMessage, { showMessage } from "react-native-flash-message";

//Dropdown Menu
import { Picker } from "@react-native-picker/picker";

function AddIngredientForm(props) {
	const modalFlashMessage = useRef();
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

	const categories = [
		"Herbs",
		"Spices",
		"Vegetable",
		"Seasoning",
		"Fruit",
		"Flavoring",
		"Others",
	];

	const getCurrentDate = () => {
		var date = new Date().getDate();
		var month = new Date().getMonth() + 1;
		var year = new Date().getFullYear();

		return year + "-" + month + "-" + date;
	};

	const currentDate = getCurrentDate();

	const AddToFirestore = async (data) => {
		let history = [];

		let log = {
			type: "",
			name: "",
			amount: "",
			price: "",
			supplier: "",
			date: "",
		};

		log.type = "Initialized";
		log.name = data.name;
		log.amount = parseInt(data.quantity);
		log.price = parseInt(data.price);
		log.supplier = "Admin";
		log.date = currentDate;

		history.push(log);

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
				history: history,
			},
			{ merge: true }
		);

		showMessage({
			message: `Successfully added ${data.name}`,
			type: "success",
		});
	};

	const validate = (values) => {
		if (
			!values.name ||
			!values.quantity ||
			!values.category ||
			!values.unitOfMeasurement ||
			!values.imageURI ||
			!values.safetyStock ||
			!values.demandDuringLead ||
			!values.annualDemand ||
			!values.annualHoldingCost ||
			!values.annualOrderCost
		) {
			return false;
		} else {
			const letters = /^[a-zA-Z\s]*$/;

			return letters.test(values.name) &&
				letters.test(values.category) &&
				letters.test(values.unitOfMeasurement) &&
				!isNaN(values.quantity) &&
				!isNaN(values.safetyStock) &&
				!isNaN(values.demandDuringLead) &&
				!isNaN(values.annualDemand) &&
				!isNaN(values.annualHoldingCost) &&
				!isNaN(values.annualOrderCost)
				? true
				: false;
		}
	};

	return (
		<View style={styles.container}>
			<Formik
				initialValues={initialValues}
				onSubmit={(values, { resetForm }) => {
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
						<Picker
							style={{ height: 40 }}
							selectedValue={props.values.category}
							mode="dropdown"
							onValueChange={props.handleChange("category")}
						>
							<Picker.Item label="Select Category:" value="" />
							{categories.map((category) => {
								return (
									<Picker.Item
										label={category.toString()}
										value={category.toString()}
										key={category.toString()}
									/>
								);
							})}
						</Picker>
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
								if (validate(props.values)) {
									props.handleSubmit();
									modalFlashMessage.current.showMessage({
										message: `Successfully added item!`,
										type: "success",
									});
								} else {
									modalFlashMessage.current.showMessage({
										message: `Wrong input details!`,
										type: "danger",
									});
								}
							}}
							style={styles.button}
						>
							<Text style={{ fontSize: 18, color: "white" }}>Submit</Text>
						</TouchableOpacity>
					</View>
				)}
			</Formik>
			<FlashMessage
				ref={modalFlashMessage}
				position="bottom"
				floating={true}
				icon={"auto"}
			/>
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
