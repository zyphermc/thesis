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

import {
	doc,
	onSnapshot,
	updateDoc,
	collection,
	getDocs,
} from "firebase/firestore";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

//Forms
import { Formik } from "formik";

//Dropdown Menu
import { Picker } from "@react-native-picker/picker";

import { db } from "../../../../firebase-config";

//Modals
import ProductHistoryModal from "./ProductHistoryModal";

//Flash message
import FlashMessage, { showMessage } from "react-native-flash-message";

function ViewProductModal(props) {
	const [productData, SetProductData] = useState([]);
	const [isEditable, SetIsEditable] = useState(false);
	const [historyModalOpen, SetHistoryModalOpen] = useState(false);
	const [ingredientsNames, SetIngredientNames] = useState([]);
	const measurements = ["grams", "mL"];

	const modalFlashMessage = useRef();

	useEffect(async () => {
		let isMounted = true;

		//Get Products from Firestore
		const unsubProducts = onSnapshot(
			doc(db, "products", props.itemName),
			(doc) => {
				if (isMounted) {
					SetProductData(doc.data());
				}
			}
		);

		//Get ingredient list to show in dropdown
		const ingredientsColRef = collection(db, "ingredients");
		const ingredientsColSnapshot = await getDocs(ingredientsColRef);

		const myIngredients = [];

		ingredientsColSnapshot.forEach((doc) => {
			myIngredients.push(doc.data());
		});

		if (isMounted) {
			const ingredient_names = myIngredients.map(
				({ ingredient_name }) => ingredient_name
			);

			SetIngredientNames(ingredient_names);
		}

		return () => {
			isMounted = false;
			unsubProducts();
		};
	}, []);

	const Capitalize = (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	const AddToFirestore = async (data) => {
		if (productData.product_category === "Food") {
			await updateDoc(
				doc(db, "products", data.name),
				{
					product_name: data.name,
					product_category: data.category,
					product_description: data.description,
					product_sellingPrice: data.price,
					product_vatPercent: parseInt(data.vatPercent),
					product_imageURI: data.imageURI,
					recipe: data.recipe,
				},
				{ merge: true }
			);
		} else {
			await updateDoc(
				doc(db, "products", data.name),
				{
					product_name: data.name,
					product_category: data.category,
					product_description: data.description,
					selling_prices: data.selling_prices,
					product_vatPercent: parseInt(data.vatPercent),
					product_imageURI: data.imageURI,
					recipe: data.recipe,
				},
				{ merge: true }
			);
		}
	};

	const OpenHistoryModal = () => {
		SetHistoryModalOpen(true);
	};

	const CloseHistoryModal = () => {
		SetHistoryModalOpen(false);
	};

	const validate = (values) => {
		if (values.category == "Food") {
			if (
				!values.name ||
				!values.description ||
				!values.price ||
				!values.vatPercent ||
				!values.imageURI ||
				!values.recipe
			) {
				return false;
			} else {
				const letters = /^[a-zA-Z\s]*$/;

				return letters.test(values.name) &&
					!isNaN(values.price) &&
					!isNaN(values.vatPercent)
					? true
					: false;
			}
		} else {
			if (
				!values.name ||
				!values.description ||
				!values.selling_prices ||
				!values.vatPercent ||
				!values.imageURI ||
				!values.recipe
			) {
				return false;
			} else {
				const letters = /^[a-zA-Z\s]*$/;

				return letters.test(values.name) &&
					values.selling_prices.map((price) => {
						console.log(!isNaN(price.selling_price));
						return !isNaN(price.selling_price);
					}) &&
					!isNaN(values.vatPercent)
					? true
					: false;
			}
		}
	};

	function FormComponent(props) {
		if (typeof productData.product_name != "undefined") {
			let initialValues = {};

			if (productData.product_category === "Food") {
				initialValues = {
					name: productData.product_name,
					description: productData.product_description,
					category: productData.product_category,
					quantity: productData.product_quantity,
					price: productData.product_sellingPrice,
					vatPercent: productData.product_vatPercent,
					imageURI: productData.product_imageURI,
					recipe: productData.recipe,
				};
			} else {
				initialValues = {
					name: productData.product_name,
					description: productData.product_description,
					category: productData.product_category,
					quantities: productData.product_quantities,
					selling_prices: productData.selling_prices,
					vatPercent: productData.product_vatPercent,
					imageURI: productData.product_imageURI,
					recipe: productData.recipe,
				};
			}

			return (
				<ScrollView>
					<Formik
						initialValues={initialValues}
						onSubmit={(values) => {
							AddToFirestore(values);
							SetIsEditable(false);
						}}
					>
						{(props) => (
							<View>
								<View style={styles.infoContainer}>
									<Text style={styles.infoText}>Name: </Text>
									<TextInput
										style={styles.input}
										placeholder="Product Name"
										onChangeText={props.handleChange("name")}
										defaultValue={productData.product_name}
										editable={isEditable}
									/>
								</View>
								<View style={styles.infoContainer}>
									<Text style={styles.infoText}>Category: </Text>
									<TextInput
										style={styles.input}
										placeholder="Product Category"
										onChangeText={props.handleChange("category")}
										defaultValue={productData.product_category}
										editable={false}
									/>
								</View>
								<View style={styles.infoContainer}>
									<Text style={styles.infoText}>Description: </Text>
									<TextInput
										style={styles.input}
										placeholder="Product Description"
										onChangeText={props.handleChange("description")}
										defaultValue={productData.product_description}
										editable={isEditable}
									/>
								</View>
								<View style={styles.infoContainer}>
									<Text style={styles.infoText}>Quantity: </Text>
									{props.values.category === "Food" ? (
										<View>
											<TextInput
												style={styles.input}
												placeholder="Product Quantity"
												defaultValue={productData.product_quantity.toString()}
												editable={false}
											/>
										</View>
									) : (
										<View style={{ flex: 1 }}>
											{props.values.quantities.map(
												(quantity, quantityIndex) => {
													return (
														<View
															style={{
																flexDirection: "row",
																justifyContent: "space-between",
															}}
															key={quantityIndex}
														>
															<Text style={{ fontSize: 20 }}>
																{Capitalize(quantity.size)}
															</Text>
															<TextInput
																style={{ fontSize: 20 }}
																placeholder="Product Quantity"
																defaultValue={quantity.quantity.toString()}
																editable={false}
															/>
														</View>
													);
												}
											)}
										</View>
									)}
								</View>
								<View
									style={{
										flex: 1,
										borderWidth: 1,
										borderColor: "#C7D02F",
										backgroundColor: "#ddd",
										marginHorizontal: 5,
										marginVertical: 2,
									}}
								>
									<Text style={styles.infoText}>Product Price: </Text>
									{props.values.category === "Food" ? (
										<TextInput
											style={[styles.input, { marginLeft: 5 }]}
											placeholder="Product Price"
											onChangeText={(val) => {
												props.setFieldValue("price", parseInt(val));
											}}
											defaultValue={String(props.values.price)}
											editable={isEditable}
										/>
									) : (
										<View>
											{props.values.selling_prices.map(
												(prices, pricesIndex) => {
													return (
														<View
															style={{ flexDirection: "row" }}
															key={pricesIndex}
														>
															<Picker
																style={{
																	height: 40,
																	width: 150,
																	backgroundColor: "transparent",
																}}
																enabled={isEditable}
																selectedValue={prices.size}
																mode="dropdown"
																onValueChange={props.handleChange(
																	`selling_prices[${pricesIndex}].size`
																)}
															>
																<Picker.Item
																	label={"Large"}
																	value={"large"}
																	key={"large"}
																/>
																<Picker.Item
																	label={"Medium"}
																	value={"medium"}
																	key={"medium"}
																/>
																<Picker.Item
																	label={"Small"}
																	value={"small"}
																	key={"small"}
																/>
															</Picker>
															<TextInput
																style={{ flex: 1, fontSize: 20 }}
																placeholder="Product Price"
																onChangeText={props.handleChange(
																	`selling_prices[${pricesIndex}].selling_price`
																)}
																defaultValue={prices.selling_price.toString()}
																editable={isEditable}
															/>
														</View>
													);
												}
											)}
										</View>
									)}
								</View>
								<View style={styles.infoContainer}>
									<Text style={styles.infoText}>VAT %: </Text>
									<TextInput
										style={styles.input}
										placeholder="VAT %"
										onChangeText={props.handleChange("vatPercent")}
										defaultValue={productData.product_vatPercent.toString()}
										editable={isEditable}
									/>
								</View>
								<View style={styles.infoContainer}>
									<Text style={styles.infoText}>Image Link: </Text>
									<TextInput
										style={styles.input}
										placeholder="Image URI"
										onChangeText={props.handleChange("imageURI")}
										defaultValue={productData.product_imageURI.toString()}
										editable={isEditable}
									/>
								</View>
								{props.values.category != "Drinks" ? (
									<View style={styles.recipeContainer}>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
											}}
										>
											<Text style={styles.infoText}>Recipe:</Text>
										</View>
										{props.values.recipe.map((ingredient, index) => {
											return (
												<View key={index} style={styles.recipeIngredient}>
													<Picker
														style={{ height: 40, width: 140 }}
														enabled={isEditable}
														selectedValue={ingredient.name}
														mode="dropdown"
														onValueChange={props.handleChange(
															`recipe[${index}].name`
														)}
													>
														{ingredientsNames.map((name) => {
															return (
																<Picker.Item
																	label={name.toString()}
																	value={name.toString()}
																	key={name.toString()}
																/>
															);
														})}
													</Picker>

													<TextInput
														style={styles.input}
														placeholder="Amount"
														onChangeText={(val) => {
															props.setFieldValue(
																`recipe[${index}].amount`,
																parseInt(val)
															);
														}}
														defaultValue={ingredient.amount.toString()}
														editable={isEditable}
													/>

													<Picker
														style={{ height: 40, width: 140 }}
														enabled={isEditable}
														selectedValue={ingredient.measureType}
														mode="dropdown"
														onValueChange={props.handleChange(
															`recipe[${index}].measureType`
														)}
													>
														{measurements.map((measureType) => {
															return (
																<Picker.Item
																	label={measureType.toString()}
																	value={measureType.toString()}
																	key={measureType.toString()}
																/>
															);
														})}
													</Picker>
												</View>
											);
										})}
									</View>
								) : (
									<View style={styles.recipeContainer}>
										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
											}}
										>
											<Text style={styles.infoText}>Recipes:</Text>
										</View>

										{props.values.recipe.map((myRecipe, indexRecipe) => {
											return (
												<View key={indexRecipe} style={{ padding: 10 }}>
													<Picker
														style={{
															height: 40,
															width: 140,
															backgroundColor: "gray",
														}}
														enabled={isEditable}
														selectedValue={myRecipe.size}
														mode="dropdown"
														onValueChange={props.handleChange(
															`recipe[${indexRecipe}].size`
														)}
													>
														<Picker.Item
															label={"Large"}
															value={"large"}
															key={"large"}
														/>
														<Picker.Item
															label={"Medium"}
															value={"medium"}
															key={"medium"}
														/>
														<Picker.Item
															label={"Small"}
															value={"small"}
															key={"small"}
														/>
													</Picker>

													{myRecipe.ingredients.map((myIngredient, index) => {
														return (
															<View
																key={index}
																style={{
																	flexDirection: "row",
																	padding: 10,
																	marginBottom: 10,
																}}
															>
																<Picker
																	style={{ height: 40, width: 140 }}
																	enabled={isEditable}
																	selectedValue={myIngredient.name}
																	mode="dropdown"
																	onValueChange={props.handleChange(
																		`recipe[${indexRecipe}].ingredients[${index}].name`
																	)}
																>
																	{ingredientsNames.map((name) => {
																		return (
																			<Picker.Item
																				label={name.toString()}
																				value={name.toString()}
																				key={name.toString()}
																			/>
																		);
																	})}
																</Picker>
																<TextInput
																	style={styles.input}
																	placeholder="Amount"
																	onChangeText={(val) => {
																		props.setFieldValue(
																			`recipe[${indexRecipe}].ingredients[${index}].amount`,
																			parseInt(val)
																		);
																	}}
																	defaultValue={myIngredient.amount.toString()}
																	editable={isEditable}
																/>
																<Picker
																	style={{
																		height: 40,
																		width: 140,
																	}}
																	enabled={isEditable}
																	selectedValue={myIngredient.measureType}
																	mode="dropdown"
																	onValueChange={props.handleChange(
																		`recipe[${indexRecipe}].ingredients[${index}].measureType`
																	)}
																>
																	{measurements.map((measureType) => {
																		return (
																			<Picker.Item
																				label={measureType.toString()}
																				value={measureType.toString()}
																				key={measureType.toString()}
																			/>
																		);
																	})}
																</Picker>
															</View>
														);
													})}
												</View>
											);
										})}
									</View>
								)}

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
					<FlashMessage
						ref={modalFlashMessage}
						position="bottom"
						floating={true}
						icon={"auto"}
					/>
				</ScrollView>
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

			<TouchableOpacity style={styles.historyButton} onPress={OpenHistoryModal}>
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

			<Modal
				visible={historyModalOpen}
				animationType="slide"
				onRequestClose={CloseHistoryModal}
			>
				<ProductHistoryModal
					CloseModal={CloseHistoryModal}
					productData={productData}
				/>
			</Modal>

			<View style={styles.imageContainer}>
				<Image
					style={styles.image}
					source={{ uri: productData.product_imageURI }}
				/>
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
		marginRight: 15,
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
	recipeContainer: {
		flex: 1,
		marginHorizontal: 5,
		backgroundColor: "#ddd",
		padding: 5,
		borderColor: "#C7D02F",
		borderWidth: 1,
	},
	recipeIngredient: {
		marginLeft: 20,
		flexDirection: "row",
	},
});
export default ViewProductModal;
