import React, { useState, useEffect, useRef } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	ImageBackground,
	Image,
	TextInput,
	ScrollView,
	Modal,
} from "react-native";

import { doc, onSnapshot, updateDoc } from "firebase/firestore";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

//Forms
import { Formik } from "formik";

import { db } from "../../../../firebase-config";

//Restock Modal
import RestockModal from "./RestockModal";
import IngredientHistoryModal from "./IngredientHistoryModal";

//Flash message
import FlashMessage, { showMessage } from "react-native-flash-message";

function ViewIngredientModal(props) {
	const [ingredientData, SetIngredientData] = useState([]);
	const [isEditable, SetIsEditable] = useState(false);
	const [restockModalOpen, SetRestockModalOpen] = useState(false);
	const [historyModalOpen, SetHistoryModalOpen] = useState(false);

	const modalFlashMessage = useRef();

	useEffect(() => {
		let isMounted = true;

		//Get Ingredients from Firestore
		const unsub = onSnapshot(
			doc(db, "ingredients", props.itemName),
			async (document) => {
				if (isMounted) {
					SetIngredientData(document.data());

					const buyLogs = document.data().history.filter((item) => {
						return item.type == "Initialized" || item.type == "Restock";
					});

					const buyCount = buyLogs.length;

					let tempPrice = 0;

					buyLogs.map((entry) => {
						tempPrice += entry.price;
					});

					const average_price = tempPrice / buyCount;

					await updateDoc(
						doc(db, "ingredients", document.data().ingredient_name),
						{
							ingredient_unitPrice_avg: Math.round(average_price),
						}
					);
				}
			}
		);
		return () => {
			isMounted = false;
			unsub();
		};
	}, []);

	const ShowHistoryLog = () => {
		OpenHistoryModal();
	};

	const AddToFirestore = async (data) => {
		await updateDoc(
			doc(db, "ingredients", data.name),
			{
				ingredient_name: data.name,
				ingredient_category: data.category,
				ingredient_stock: parseInt(data.quantity),
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

	const OpenRestockModal = () => {
		SetRestockModalOpen(true);
	};

	const CloseRestockModal = () => {
		SetRestockModalOpen(false);
	};

	const OpenHistoryModal = () => {
		SetHistoryModalOpen(true);
	};

	const CloseHistoryModal = () => {
		SetHistoryModalOpen(false);
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

	function FormComponent(props) {
		if (typeof ingredientData.ingredient_name != "undefined") {
			const initialValues = {
				name: ingredientData.ingredient_name,
				category: ingredientData.ingredient_category,
				quantity: ingredientData.ingredient_stock,
				unitOfMeasurement: ingredientData.unit_of_measurement,
				imageURI: ingredientData.imageURI,
				safetyStock: ingredientData.safety_stock,
				demandDuringLead: ingredientData.demand_during_lead,
				annualDemand: ingredientData.annual_demand,
				annualHoldingCost: ingredientData.annual_holding_cost,
				annualOrderCost: ingredientData.annual_order_cost,
			};

			return (
				<View style={{ flex: 1 }}>
					<Modal
						visible={restockModalOpen}
						animationType="slide"
						onRequestClose={CloseRestockModal}
					>
						<RestockModal
							CloseModal={CloseRestockModal}
							ingredientData={ingredientData}
						/>
					</Modal>

					<Modal
						visible={historyModalOpen}
						animationType="slide"
						onRequestClose={CloseHistoryModal}
					>
						<IngredientHistoryModal
							CloseModal={CloseHistoryModal}
							ingredientData={ingredientData}
						/>
					</Modal>

					<ScrollView>
						<Formik
							initialValues={initialValues}
							onSubmit={(values) => {
								AddToFirestore(values);
							}}
						>
							{(props) => (
								<View style={{ flex: 1 }}>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>Name:</Text>
										<TextInput
											style={styles.input}
											placeholder="Ingredient Name"
											onChangeText={props.handleChange("name")}
											defaultValue={ingredientData.ingredient_name}
											editable={isEditable}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>Category:</Text>
										<TextInput
											style={styles.input}
											placeholder="Category"
											onChangeText={props.handleChange("category")}
											defaultValue={ingredientData.ingredient_category}
											editable={isEditable}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>Quantity:</Text>
										<TextInput
											style={styles.input}
											placeholder="Quantity"
											onChangeText={props.handleChange("quantity")}
											defaultValue={ingredientData.ingredient_stock.toString()}
											keyboardType="numeric"
											editable={isEditable}
										/>
										<TouchableOpacity
											onPress={() => {
												OpenRestockModal();
											}}
										>
											<Ionicons
												name="add-circle-outline"
												size={40}
												color={"green"}
											/>
										</TouchableOpacity>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>Unit of Measurement:</Text>
										<TextInput
											style={styles.input}
											placeholder="Unit of Measurement"
											onChangeText={props.handleChange("unitOfMeasurement")}
											defaultValue={ingredientData.unit_of_measurement}
											editable={isEditable}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>Avg. Buying Price (₱):</Text>
										<TextInput
											style={styles.input}
											defaultValue={ingredientData.ingredient_unitPrice_avg.toString()}
											editable={false}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>
											Safety Stock ({ingredientData.unit_of_measurement}):
										</Text>
										<TextInput
											style={styles.input}
											placeholder="Safety Stock"
											onChangeText={props.handleChange("safetyStock")}
											defaultValue={ingredientData.safety_stock.toString()}
											keyboardType="numeric"
											editable={isEditable}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>
											Demand during Lead Time (
											{ingredientData.unit_of_measurement}):
										</Text>
										<TextInput
											style={styles.input}
											placeholder="Demand during lead time"
											onChangeText={props.handleChange("demandDuringLead")}
											defaultValue={ingredientData.demand_during_lead.toString()}
											keyboardType="numeric"
											editable={isEditable}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>
											Annual Demand ({ingredientData.unit_of_measurement}):
										</Text>
										<TextInput
											style={styles.input}
											placeholder="Annual Demand"
											onChangeText={props.handleChange("annualDemand")}
											defaultValue={ingredientData.annual_demand.toString()}
											keyboardType="numeric"
											editable={isEditable}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>
											Annual Holding Cost (₱):
										</Text>
										<TextInput
											style={styles.input}
											placeholder="Annual Holding Cost in ₱"
											onChangeText={props.handleChange("annualHoldingCost")}
											defaultValue={ingredientData.annual_holding_cost.toString()}
											keyboardType="numeric"
											editable={isEditable}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>Annual Order Cost (₱):</Text>
										<TextInput
											style={styles.input}
											placeholder="Annual Ordering Cost in ₱ (e.g. shipping fee, supplier fees, etc.)"
											onChangeText={props.handleChange("annualOrderCost")}
											defaultValue={ingredientData.annual_order_cost.toString()}
											keyboardType="numeric"
											editable={isEditable}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>
											Reorder Point ({ingredientData.unit_of_measurement}):
										</Text>
										<TextInput
											style={styles.input}
											defaultValue={ingredientData.reorder_point.toString()}
											editable={false}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>
											Order Size ({ingredientData.unit_of_measurement}):
										</Text>
										<TextInput
											style={styles.input}
											defaultValue={ingredientData.order_size.toString()}
											editable={false}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>Stock Status:</Text>
										<TextInput
											style={styles.input}
											defaultValue={ingredientData.stock_status}
											editable={false}
										/>
									</View>
									<View style={styles.infoContainer}>
										<Text style={styles.infoText}>Image Link:</Text>
										<TextInput
											style={styles.input}
											placeholder="Image Link"
											onChangeText={props.handleChange("imageURI")}
											defaultValue={ingredientData.imageURI}
											editable={isEditable}
										/>
									</View>
									<TouchableOpacity
										onPress={() => {
											if (validate(props.values)) {
												props.handleSubmit();
												modalFlashMessage.current.showMessage({
													message: `Successfully updated item!`,
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
										<Text style={{ fontSize: 18, color: "white" }}>
											Submit Changes
										</Text>
									</TouchableOpacity>
								</View>
							)}
						</Formik>
					</ScrollView>
					<FlashMessage
						ref={modalFlashMessage}
						position="bottom"
						floating={true}
						icon={"auto"}
					/>
				</View>
			);
		} else {
			return null;
		}
	}

	return (
		<ImageBackground
			source={{
				uri: "https://i.ibb.co/4Vzwdcc/Pngtree-milk-tea-shop-poster-background-1021135.jpg",
			}}
			resizeMode="cover"
			style={styles.container}
		>
			<TouchableOpacity style={styles.closeButton} onPress={props.closeModal}>
				<Ionicons name="close-outline" size={40} color={"black"} />
			</TouchableOpacity>

			<TouchableOpacity style={styles.historyButton} onPress={ShowHistoryLog}>
				<Ionicons name="newspaper-outline" size={40} color={"black"} />
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.editableButton}
				onPress={() => {
					if (isEditable) {
						SetIsEditable(false);
					} else {
						SetIsEditable(true);
					}
				}}
			>
				<Ionicons
					name={isEditable ? "lock-open-outline" : "lock-closed-outline"}
					size={40}
					color={"black"}
				/>
			</TouchableOpacity>

			<View style={styles.imageContainer}>
				<Image style={styles.image} source={{ uri: ingredientData.imageURI }} />
			</View>

			<FormComponent />
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	closeButton: {
		position: "absolute",
		right: 10,
	},
	historyButton: {
		position: "absolute",
		right: 10,
		top: 50,
	},
	editableButton: {
		position: "absolute",
		right: 10,
		top: 180,
	},
	infoContainer: {
		flex: 1,
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
	imageContainer: {
		alignItems: "center",
		marginTop: 30,
	},
	image: {
		height: 200,
		width: 200,
		borderWidth: 3,
		borderRadius: 50,
		borderColor: "#66D5F8",
	},
	input: {
		flex: 1,
		alignSelf: "flex-start",
		height: 50,
		padding: 10,
		fontSize: 20,
		borderRadius: 8,
	},
	button: {
		height: 60,
		marginHorizontal: 10,
		marginVertical: 4,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#67BA64",
		borderRadius: 8,
	},
});

export default ViewIngredientModal;
