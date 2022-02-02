import React, { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	TextInput,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Button,
} from "react-native";
import { doc, increment, updateDoc } from "firebase/firestore";
import { Formik } from "formik";
import { db } from "../../../../firebase-config";
import FlashMessage, { showMessage } from "react-native-flash-message";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

function RestockModal(props) {
	let initialValues = {
		type: "Restock",
		name: props.ingredientData.ingredient_name,
		amount: "",
		price: "",
		supplier: "",
		date: "",
	};

	const modalFlashMessage = useRef();

	const getCurrentDate = () => {
		var date = new Date().getDate();
		var month = new Date().getMonth() + 1;
		var year = new Date().getFullYear();

		return year + "-" + month + "-" + date;
	};

	const currentDate = getCurrentDate();

	const SetTransactionLog = async (data) => {
		let transactionLog = {
			type: "",
			name: "",
			amount: "",
			price: "",
			supplier: "",
			date: "",
		};

		transactionLog.type = data.type;
		transactionLog.name = data.name;
		transactionLog.amount = parseInt(data.amount);
		transactionLog.price = parseInt(data.price);
		transactionLog.supplier = data.supplier;
		transactionLog.date = currentDate;

		let history = props.ingredientData.history;

		history.push(transactionLog);

		await updateDoc(doc(db, "ingredients", data.name), {
			ingredient_stock: increment(parseInt(data.amount)),
			history: history,
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<TouchableOpacity style={styles.closeButton} onPress={props.CloseModal}>
				<Ionicons name="close-outline" size={40} color={"black"} />
			</TouchableOpacity>

			<View style={styles.container}>
				<Text style={styles.infoText}>Restock Form:</Text>

				<Formik
					initialValues={initialValues}
					onSubmit={(values) => {
						SetTransactionLog(values);
						props.CloseModal();
					}}
				>
					{(props) => (
						<View>
							<View style={styles.infoContainer}>
								<Text style={styles.infoText}>Name:</Text>
								<TextInput
									style={styles.input}
									placeholder="Ingredient Name"
									onChangeText={props.handleChange("name")}
									defaultValue={props.values.name}
									editable={false}
								/>
							</View>
							<View style={styles.infoContainer}>
								<Text style={styles.infoText}>Type:</Text>
								<TextInput
									style={styles.input}
									placeholder="Transaction Type"
									onChangeText={props.handleChange("type")}
									defaultValue={props.values.type}
									editable={false}
								/>
							</View>
							<View style={styles.infoContainer}>
								<Text style={styles.infoText}>Amount:</Text>
								<TextInput
									style={styles.input}
									placeholder="Amount"
									onChangeText={props.handleChange("amount")}
									keyboardType="number-pad"
								/>
							</View>
							<View style={styles.infoContainer}>
								<Text style={styles.infoText}>Price:</Text>
								<TextInput
									style={styles.input}
									placeholder="Price"
									onChangeText={props.handleChange("price")}
									keyboardType="number-pad"
								/>
							</View>
							<View style={styles.infoContainer}>
								<Text style={styles.infoText}>Supplier:</Text>
								<TextInput
									style={styles.input}
									placeholder="Supplier"
									onChangeText={props.handleChange("supplier")}
								/>
							</View>
							<View style={styles.infoContainer}>
								<Text style={styles.infoText}>Date:</Text>
								<TextInput
									style={styles.input}
									placeholder="Date"
									onChangeText={props.handleChange("date")}
									defaultValue={currentDate}
									editable={false}
								/>
							</View>
							<TouchableOpacity
								onPress={() => {
									if (
										props.values.amount > 0 &&
										props.values.price > 0 &&
										props.values.supplier != ""
									) {
										props.handleSubmit();
									} else {
										modalFlashMessage.current.showMessage({
											message: `Fill up important fields!`,
											type: "danger",
										});
									}
								}}
								style={styles.button}
							>
								<Text style={{ fontSize: 18, color: "white" }}>
									Submit Restock
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</Formik>
			</View>
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
	button: {
		height: 60,
		marginHorizontal: 10,
		marginVertical: 4,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#67BA64",
		borderRadius: 8,
	},
	container: {
		flex: 1,
		marginTop: 40,
	},
	closeButton: {
		position: "absolute",
		right: 10,
	},
	infoContainer: {
		flexDirection: "row",

		alignItems: "center",
		borderWidth: 1,
		borderColor: "#C7D02F",
		backgroundColor: "#ddd",
		marginHorizontal: 5,
		marginVertical: 2,
	},
	infoText: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 4,
	},
	input: {
		flex: 1,
		alignSelf: "flex-start",
		height: 50,
		padding: 10,
		fontSize: 20,
		borderRadius: 8,
	},
});

export default RestockModal;
