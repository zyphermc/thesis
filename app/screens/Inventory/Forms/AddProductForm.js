import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	TextInput,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import { Formik } from "formik";
import { doc, collection, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase-config";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

//Dropdown Menu
import { Picker } from "@react-native-picker/picker";

function AddProductForm(props) {
	const measurements = ["grams", "mL"];
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

	const [foodRecipeData, SetFoodRecipeData] = useState([foodRecipeTemplate]);
	const [drinkRecipeData, SetDrinkRecipeData] = useState([drinkRecipeTemplate]);
	const [currentCategory, SetCurrentCategory] = useState("Food");
	const [count, setCount] = useState(0);
	const onPressAdd = () => setCount((prevCount) => prevCount + 1);

	const initialValues = {
		name: "",
		category: "",
		description: "",
		quantity: "", //to be removed, going to be automatically calculated based on recipe
		price: "",
		vatPercent: "",
		imageURI: "",
		foodRecipe: foodRecipeData,
		drinkRecipe: drinkRecipeData,
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
				//recipe: data.recipe,
			},
			{ merge: true }
		);
	};

	const addRecipe = (category) => {
		if (category === "Food") {
			let newRecipe = foodRecipeData.concat(foodRecipeTemplate);
			SetFoodRecipeData(newRecipe);
		} else {
			let newRecipe = drinkRecipeData.concat(drinkRecipeTemplate);
			SetDrinkRecipeData(newRecipe);
		}
	};

	const removeRecipe = (category) => {
		if (category === "Food") {
			let newRecipe = foodRecipeData.pop();
			SetFoodRecipeData(newRecipe);
		} else {
			let newRecipe = drinkRecipeData.pop();
			SetDrinkRecipeData(newRecipe);
		}
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
					Add Ingredient:
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
												props.values.foodRecipe.push(foodRecipeTemplate);
												addRecipe("Food");
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
												props.values.foodRecipe.pop();
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
								{currentCategory === "Food" ? (
									props.values.foodRecipe.map((ingredient, index) => {
										return (
											<View key={index} style={styles.recipeIngredient}>
												<Picker
													style={{ height: 40, width: 140 }}
													selectedValue={props.values.foodRecipe[index].name}
													mode="dropdown"
													onValueChange={props.handleChange(
														`foodRecipe[${index}].name`
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
															`foodRecipe[${index}].amount`,
															parseInt(val)
														);
													}}
												/>

												<Picker
													style={{ flex: 1 }}
													selectedValue={
														props.values.foodRecipe[index].measureType
													}
													mode="dropdown"
													onValueChange={props.handleChange(
														`foodRecipe[${index}].measureType`
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
									})
								) : (
									<></>
								)}
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
