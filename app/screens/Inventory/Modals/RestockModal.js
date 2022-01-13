import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	TextInput,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Button,
} from "react-native";
import { Formik } from "formik";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

function RestockModal(props) {
	let transactionLog = {
		type: "Restock",
		name: props.ingredientData.ingredient_name,
		amount: "",
		supplier: "",
		date: "",
	};

	const getCurrentDate = () => {
		var date = new Date().getDate();
		var month = new Date().getMonth() + 1;
		var year = new Date().getFullYear();

		return year + "-" + month + "-" + date;
	};

	const currentDate = getCurrentDate();

	//props.LogTransaction(data) is passed here

	return (
		<View style={{ flex: 1 }}>
			<TouchableOpacity style={styles.closeButton}>
				<Ionicons name="close-outline" size={40} color={"black"} />
			</TouchableOpacity>

			<View style={styles.container}>
				<Text style={styles.infoText}>Restock Form:</Text>

				<Formik
					initialValues={transactionLog}
					onSubmit={(values) => {
						console.log(values);
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
								<Text style={styles.infoText}>Supplier:</Text>
								<TextInput
									style={styles.input}
									placeholder="Supplier "
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
									props.handleSubmit();
								}}
								style={styles.button}
							>
								<Text style={{ fontSize: 18, color: "white" }}>
									Submit Changes
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</Formik>
			</View>
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
		alignSelf: "flex-start",
		height: 50,
		padding: 10,
		fontSize: 20,
		borderRadius: 8,
	},
});

export default RestockModal;
