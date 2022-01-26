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
import { doc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase-config";
import { showMessage } from "react-native-flash-message";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

//Dropdown Menu
import { Picker } from "@react-native-picker/picker";

function AddProductForm(props) {
	const measurements = ["grams", "mL", "pcs"];
	const [ingredientsNames, SetIngredientNames] = useState([]);

	useEffect(async () => {
		let isMounted = true;

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
		};
	}, []);

	const categories = ["Food", "Drinks"];

	let foodRecipeTemplate = {
		name: "",
		amount: "",
		measureType: "",
	};

	let drinkRecipeTemplate = {
		size: "",
		ingredients: [
			{
				name: "",
				amount: "",
				measureType: "",
			},
		],
	};

	let sellingPricesTemplate = [
		{ size: "small", selling_price: "" },
		{ size: "medium", selling_price: "" },
		{ size: "large", selling_price: "" },
	];

	const [foodRecipeData, SetFoodRecipeData] = useState([foodRecipeTemplate]);
	const [drinkRecipeData, SetDrinkRecipeData] = useState([drinkRecipeTemplate]);
	const [currentCategory, SetCurrentCategory] = useState("Food");
	const [count, setCount] = useState(1);
	const onPressAdd = () => setCount((prevCount) => prevCount + 1);

	const initialValues = {
		name: "",
		category: "",
		description: "",
		price: "",
		selling_prices: sellingPricesTemplate,
		vatPercent: "",
		imageURI: "",
		foodRecipe: foodRecipeData,
		drinkRecipe: drinkRecipeData,
	};

	const getCurrentDate = () => {
		var date = new Date().getDate();
		var month = new Date().getMonth() + 1;
		var year = new Date().getFullYear();

		return year + "-" + month + "-" + date;
	};

	const currentDate = getCurrentDate();

	const AddToFirestore = async (data) => {
		let history = [];
		let log = {};

		log = {
			type: "",
			name: "",
			date: "",
			totalValue: "",
		};

		log.type = "Initialized";
		log.name = data.name;
		log.date = currentDate;
		log.totalValue = "n/a";

		history.push(log);

		let drinkQuantityTemplate = [
			{ size: "small", quantity: 0 },
			{ size: "medium", quantity: 0 },
			{ size: "large", quantity: 0 },
		];

		if (currentCategory === "Food") {
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
					recipe: data.foodRecipe,
					history: history,
				},
				{ merge: true }
			);
		} else {
			await setDoc(
				doc(db, "products", data.name),
				{
					product_name: data.name,
					product_category: data.category,
					product_description: data.description,
					product_quantities: drinkQuantityTemplate,
					selling_prices: data.selling_prices,
					product_vatPercent: parseInt(data.vatPercent),
					product_imageURI: data.imageURI,
					recipe: data.drinkRecipe,
					history: history,
				},
				{ merge: true }
			);
		}

		showMessage({
			message: `Successfully added ${data.name}`,
			type: "success",
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Text
					style={{
						fontSize: 30,
						fontWeight: "100",
						alignSelf: "center",
						left: 15,
						top: 5,
					}}
				>
					Add Product:
				</Text>
				<TouchableOpacity style={{ top: 4 }} onPress={props.closeModal}>
					<Ionicons name="close-outline" size={40} color={"black"} />
				</TouchableOpacity>
			</View>
			<ScrollView style={styles.container}>
				<Formik
					initialValues={initialValues}
					onSubmit={(values, { resetForm }) => {
						console.log(values);
						AddToFirestore(values);
						resetForm({ values: initialValues });
					}}
				>
					{(props) => (
						<View style={{ flex: 1, padding: 20 }}>
							<TextInput
								style={styles.input}
								placeholder="Product Name"
								onChangeText={props.handleChange("name")}
								value={props.values.name}
							/>
							<Picker
								style={{ height: 40 }}
								selectedValue={props.values.category}
								mode="dropdown"
								onValueChange={(val) => {
									props.handleChange("category")(val);
									SetCurrentCategory(val);
								}}
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
								placeholder="Description"
								onChangeText={props.handleChange("description")}
								value={props.values.description}
							/>
							{currentCategory === "Food" ? (
								<TextInput
									style={styles.input}
									placeholder="Selling Price in ₱"
									onChangeText={props.handleChange("price")}
									value={props.values.price}
									keyboardType="numeric"
								/>
							) : (
								<View>
									<Text style={[styles.infoText, { marginTop: 5 }]}>
										Product Prices:{" "}
									</Text>
									{props.values.selling_prices.map((prices, pricesIndex) => {
										return (
											<View style={{ flexDirection: "row" }} key={pricesIndex}>
												<Picker
													style={{
														height: 40,
														width: 150,
														backgroundColor: "transparent",
													}}
													selectedValue={prices.size}
													mode="dropdown"
													onValueChange={props.handleChange(
														`selling_prices[${pricesIndex}].size`
													)}
												>
													<Picker.Item label="Select Size:" value="" />
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
												/>
											</View>
										);
									})}
								</View>
							)}

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
							<View style={styles.recipeContainer}>
								<View
									style={{
										flex: 1,
										flexDirection: "row",
										justifyContent: "space-between",
									}}
								>
									<Text style={styles.infoText}>Recipe:</Text>
									<View style={{ flexDirection: "row" }}>
										<TouchableOpacity
											onPress={() => {
												if (currentCategory === "Food") {
													props.values.foodRecipe.push(foodRecipeTemplate);
												} else {
													props.values.drinkRecipe.push(drinkRecipeTemplate);
												}

												onPressAdd(); //this just refreshes the page lmao
											}}
										>
											<Ionicons
												name="add-circle-outline"
												size={40}
												color={"green"}
											/>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={() => {
												if (currentCategory === "Food") {
													props.values.foodRecipe.pop();
												} else {
													props.values.drinkRecipe.pop();
												}
												onPressAdd(); //this just refreshes the page lmao
											}}
										>
											<Ionicons
												name="remove-circle-outline"
												size={40}
												color={"red"}
											/>
										</TouchableOpacity>
									</View>
								</View>
								{currentCategory === "Food"
									? props.values.foodRecipe.map((ingredient, index) => {
											return (
												<View key={index} style={styles.recipeIngredient}>
													<Picker
														style={{ height: 40, width: 140 }}
														selectedValue={ingredient.name}
														mode="dropdown"
														onValueChange={props.handleChange(
															`foodRecipe[${index}].name`
														)}
													>
														<Picker.Item label="Select Ingredient:" value="" />
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
																`foodRecipe[${index}].amount`,
																parseInt(val)
															);
														}}
													/>

													<Picker
														style={{ flex: 1 }}
														selectedValue={ingredient.measureType}
														mode="dropdown"
														onValueChange={props.handleChange(
															`foodRecipe[${index}].measureType`
														)}
													>
														<Picker.Item label="Select Size:" value="" />
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
									  })
									: props.values.drinkRecipe.map((myRecipe, indexRecipe) => {
											return (
												<View key={indexRecipe} style={{ marginBottom: 10 }}>
													<View style={{ flexDirection: "row" }}>
														<Picker
															style={{ height: 60, width: 140 }}
															selectedValue={myRecipe.size}
															mode="dropdown"
															onValueChange={props.handleChange(
																`drinkRecipe[${indexRecipe}].size`
															)}
														>
															<Picker.Item label="Select Size:" value="" />
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
														<View
															style={{
																flexDirection: "row",
																alignItems: "center",
															}}
														>
															<TouchableOpacity
																onPress={() => {
																	props.values.drinkRecipe[
																		indexRecipe
																	].ingredients.push(foodRecipeTemplate);
																	onPressAdd(); //this just refreshes the page lmao
																}}
															>
																<Ionicons
																	name="add-circle-outline"
																	size={25}
																	color={"green"}
																/>
															</TouchableOpacity>
															<TouchableOpacity
																onPress={() => {
																	props.values.drinkRecipe[
																		indexRecipe
																	].ingredients.pop();
																	onPressAdd(); //this just refreshes the page lmao
																}}
															>
																<Ionicons
																	name="remove-circle-outline"
																	size={25}
																	color={"red"}
																/>
															</TouchableOpacity>
														</View>
													</View>
													{myRecipe.ingredients.map((myIngredient, index) => {
														return (
															<View key={index} style={styles.recipeIngredient}>
																<Picker
																	style={{ height: 40, width: 140 }}
																	selectedValue={myIngredient.name}
																	mode="dropdown"
																	onValueChange={props.handleChange(
																		`drinkRecipe[${indexRecipe}].ingredients[${index}].name`
																	)}
																>
																	<Picker.Item
																		label="Select Ingredient:"
																		value=""
																	/>
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
																			`drinkRecipe[${indexRecipe}].ingredients[${index}].amount`,
																			parseInt(val)
																		);
																	}}
																	defaultValue={myIngredient.amount.toString()}
																/>
																<Picker
																	style={{
																		height: 40,
																		width: 100,
																	}}
																	selectedValue={myIngredient.measureType}
																	mode="dropdown"
																	onValueChange={props.handleChange(
																		`drinkRecipe[${indexRecipe}].ingredients[${index}].measureType`
																	)}
																>
																	<Picker.Item
																		label="Select Measure:"
																		value=""
																	/>
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
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	input: {
		flex: 1,
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
	closeButton: {
		position: "absolute",
		right: 10,
	},
	infoContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		marginVertical: 2,
	},
	infoText: {
		fontSize: 20,
		fontWeight: "bold",
		marginLeft: 4,
	},
	recipeContainer: {
		flex: 1,
		padding: 5,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
	},
	recipeIngredient: {
		flexDirection: "row",
	},
});

export default AddProductForm;
