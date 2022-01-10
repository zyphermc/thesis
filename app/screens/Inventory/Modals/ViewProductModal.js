import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	ImageBackground,
	Image,
	TextInput,
	ScrollView,
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
import { Formik, Field, FieldArray } from "formik";

//Dropdown Menu
import { Picker } from "@react-native-picker/picker";

import { db } from "../../../../firebase-config";

function ViewProductModal(props) {
	const [productData, SetProductData] = useState([]);
	const [isEditable, SetIsEditable] = useState(false);
	const [ingredientsNames, SetIngredientNames] = useState([]);

	useEffect(async () => {
		let isMounted = true;

		//Get Products from Firestore
		const getProductData = async () => {
			const unsub = onSnapshot(doc(db, "products", props.itemName), (doc) => {
				if (isMounted) {
					SetProductData(doc.data());
				}
			});
		};

		getProductData();

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

	const AddToFirestore = async (data) => {
		await updateDoc(
			doc(db, "products", data.name),
			{
				product_name: data.name,
				product_category: data.category,
				product_description: data.description,
				product_quantity: parseInt(data.quantity),
				product_sellingPrice: parseInt(data.price),
				product_vatPercent: parseInt(data.vatPercent),
				product_imageURI: data.imageURI,
				recipe: data.recipe,
			},
			{ merge: true }
		);
	};

	let newRecipe = [];

	const ManipulateRecipe = (action) => {
		let recipeTemplate = {
			name: "",
			amount: "",
		};

		if (action === "log") {
			console.log(productData.recipe);
		} else if (action === "add") {
			// pseudocode for updating recipe of product in database (food)
			// 1. Get product recipe and display it in fields
			// 2. When submit is clicked, get those data and store it in
			//    an object array with 'name' and 'amount'
			// 3. updateDoc with the new object array for recipe

			recipeTemplate.name = "Garlic";
			recipeTemplate.amount = "80";
			newRecipe.push(recipeTemplate);

			console.log(newRecipe);
		} else if (action === "remove") {
			//remove from recipe array
		}
	};

	const ShowHistoryLog = () => {
		//OPEN MODAL DRAWER THAT SHOWS TRANSACTION HISTORY
		console.log("History Shown");
	};

	function FormComponent(props) {
		if (typeof productData.product_name != "undefined") {
			//console.log(ingredientsNames);

			const initialValues = {
				name: productData.product_name,
				description: productData.product_description,
				category: productData.product_category,
				quantity: productData.product_quantity,
				price: productData.product_sellingPrice,
				vatPercent: productData.product_vatPercent,
				imageURI: productData.product_imageURI,
				recipe: productData.recipe,
			};

			return (
				<ScrollView>
					<Formik
						initialValues={initialValues}
						onSubmit={(values) => {
							console.log(values);
							AddToFirestore(values);

							//ManipulateRecipe("add");
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
										editable={isEditable}
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
									<TextInput
										style={styles.input}
										placeholder="Product Quantity"
										onChangeText={props.handleChange("quantity")}
										defaultValue={productData.product_quantity.toString()}
										editable={isEditable}
									/>
								</View>
								<View style={styles.infoContainer}>
									<Text style={styles.infoText}>Product Price: </Text>
									<TextInput
										style={styles.input}
										placeholder="Product Price"
										onChangeText={props.handleChange("price")}
										defaultValue={productData.product_sellingPrice.toString()}
										editable={isEditable}
									/>
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
											<TouchableOpacity
												style={{
													justifyContent: "center",
													alignItems: "center",
												}}
												onPress={() => {
													console.log("added in array");
												}}
											>
												<Ionicons
													name="add-circle-outline"
													size={25}
													color={"green"}
												/>
											</TouchableOpacity>
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
													<TouchableOpacity
														style={{
															justifyContent: "center",
															alignItems: "center",
														}}
														onPress={() => {
															console.log("removed from array");
														}}
													>
														<Ionicons
															name="remove-circle-outline"
															size={25}
															color={"red"}
														/>
													</TouchableOpacity>
												</View>
											);
										})}
									</View>
								) : (
									<></>
								)}

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
