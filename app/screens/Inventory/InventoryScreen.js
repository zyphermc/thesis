import React, { useState, useEffect } from "react";
import {
	Text,
	StyleSheet,
	View,
	TouchableOpacity,
	FlatList,
	TextInput,
	Modal,
	ActivityIndicator,
	ImageBackground,
	Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
	collection,
	doc,
	deleteDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";

import { showMessage } from "react-native-flash-message";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

import { db } from "../../../firebase-config";

//Import Modals
import AddIngredientModal from "./Modals/AddIngredientModal";
import AddProductModal from "./Modals/AddProductModal";
import ViewIngredientModal from "./Modals/ViewIngredientModal";
import ViewProductModal from "./Modals/ViewProductModal";

//Import Ingredient List Item component
import IngredientItemComponent from "../../components/IngredientItemComponent";
import ProductItemComponent from "../../components/ProductItemComponent";

function InventoryScreen({ route }) {
	const [isAdmin] = useState(route.params.isAdmin);

	const [ingredients, SetIngredients] = useState([]);
	const [filteredIngredients, SetFilteredIngredients] = useState([]);

	const [products, SetProducts] = useState([]);
	const [filteredProducts, SetFilteredProducts] = useState([]);

	//Viewing Product or Ingredient State
	const [isViewing, SetIsViewing] = useState("Ingredients"); //Set state to "Products" when toggled by something
	const [isLoading, SetIsLoading] = useState(true);
	const [viewingItem, SetViewingItem] = useState("");

	const [modalOpen, SetModalOpen] = useState(false);
	const [viewModalOpen, SetViewModalOpen] = useState(false);

	//Ingredients and Products Firebase reference
	const ingredientsCollectionRef = collection(db, "ingredients");
	const productsCollectionRef = collection(db, "products");

	let ingredientsFast = [];
	let productsFast = [];

	useEffect(() => {
		let isMounted = true;
		SetIsLoading(true);

		const unsubIngredients = onSnapshot(
			ingredientsCollectionRef,
			(docsSnapshot) => {
				const myIngredients = [];

				//Update ROP, EOQ, and stock status of each added or modified Ingredient
				docsSnapshot.docChanges().forEach(async (change) => {
					if (change.type === "added" || change.type === "modified") {
						const ROP =
							change.doc.data().safety_stock +
							change.doc.data().demand_during_lead;
						const EOQ = Math.floor(
							Math.sqrt(
								(2 *
									change.doc.data().annual_demand *
									change.doc.data().annual_order_cost) /
									change.doc.data().annual_holding_cost
							)
						);

						const stock_status = () => {
							if (
								change.doc.data().ingredient_stock <
								change.doc.data().safety_stock
							) {
								return "LOW";
							} else if (
								change.doc.data().ingredient_stock >=
									change.doc.data().safety_stock &&
								change.doc.data().ingredient_stock < ROP
							) {
								return "REORDER";
							} else if (change.doc.data().ingredient_stock >= ROP) {
								return "GOOD";
							}
						};

						const stockStatus = stock_status();

						try {
							await updateDoc(
								doc(db, "ingredients", change.doc.data().ingredient_name),
								{
									reorder_point: ROP,
									order_size: EOQ,
									stock_status: stockStatus,
								}
							);
						} catch (err) {
							console.log(err);
						}
					}
				});

				docsSnapshot.forEach((doc) => {
					myIngredients.push(doc.data());
				});

				if (isMounted) {
					//Update Ingredient State with latest data
					ingredientsFast = myIngredients;
					SetIngredients(myIngredients);
					SetFilteredIngredients(myIngredients);
				}
			}
		);

		//Get Products from Firestore
		const unsubProducts = onSnapshot(productsCollectionRef, (docsSnapshot) => {
			const myProducts = [];

			docsSnapshot.docChanges().forEach(async (change) => {
				if (change.type === "added" || change.type === "modified") {
					//If there is a document added or modified,
					//do stuff here
				}
			});

			docsSnapshot.forEach((doc) => {
				myProducts.push(doc.data());
			});

			if (isMounted) {
				SetProducts(myProducts);
				SetFilteredProducts(myProducts);
				productsFast = myProducts;
			}
		});

		SetIsLoading(false);

		return () => {
			isMounted = false;
			unsubIngredients();
			unsubProducts();
		};
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			if (productsFast.length > 0) {
				productsFast.map((item) => {
					CalculateProductMaxQuantity(item);
				});
			}
		}, [])
	);

	const CalculateProductMaxQuantity = async (data) => {
		if (ingredientsFast.length > 0) {
			if (data.product_category == "Food") {
				let product_quantities = [];
				let availableQuantity = 0;

				data.recipe.map((ingredient) => {
					const dbIngredient = ingredientsFast.find((item) => {
						return item.ingredient_name === ingredient.name;
					});

					let tempQuantity = Math.floor(
						dbIngredient.ingredient_stock / ingredient.amount
					);

					product_quantities.push(tempQuantity);
				});

				availableQuantity = Math.min(...product_quantities);

				try {
					await updateDoc(doc(db, "products", data.product_name), {
						product_quantity: availableQuantity,
					});
				} catch (err) {
					console.log(err);
				}
			} else {
				let availableQuantities = data.product_quantities;

				data.product_quantities.map(async (quantity, index) => {
					let product_quantities = [];

					let availableQuantity = 0;

					//Get recipe according to size
					const myRecipe = data.recipe.find((item) => {
						return item.size === quantity.size;
					});

					//Iterate through each ingredient and get the max order quantity
					myRecipe.ingredients.map((ingredient) => {
						const dbIngredient = ingredientsFast.find((item) => {
							return item.ingredient_name === ingredient.name;
						});

						let tempQuantity = Math.floor(
							dbIngredient.ingredient_stock / ingredient.amount
						);

						product_quantities.push(tempQuantity);
					});

					availableQuantity = Math.min(...product_quantities);

					availableQuantities[index].quantity = availableQuantity;
				});

				try {
					await updateDoc(doc(db, "products", data.product_name), {
						product_quantities: availableQuantities,
					});
				} catch (err) {
					console.log(err);
				}
			}
		}
	};

	const handleButtonView = (itemName) => {
		//show detailed view about product
		SetViewingItem(itemName);
		SetViewModalOpen(true);
	};

	const confirmDelete = (name) =>
		Alert.alert("ATTENTION", `Are you sure to delete ${name}?`, [
			{
				text: "Cancel",
				style: "cancel",
			},
			{ text: "Confirm", onPress: () => handleButtonDelete(name) },
		]);

	const handleButtonDelete = async (name) => {
		//if needed: show confirmation message then
		//delete document from database
		if (isViewing === "Ingredients") {
			await deleteDoc(doc(db, "ingredients", name));
		} else {
			await deleteDoc(doc(db, "products", name));
		}

		showMessage({
			message: `Succesfully deleted ${name}`,
			type: "success",
		});
	};

	const handleOpenModal = () => {
		//open add ingredient modal
		SetModalOpen(true);
	};

	const SearchNameIngredient = (input) => {
		const data = ingredients;

		const searchData = data.filter((item) => {
			return (
				item.ingredient_name.toLowerCase().includes(input.toLowerCase()) ||
				item.ingredient_category.toLowerCase().includes(input.toLowerCase()) ||
				item.stock_status.toLowerCase().includes(input.toLowerCase())
			);
		});

		SetFilteredIngredients(searchData);
	};

	const SearchNameProduct = (input) => {
		const data = products;

		const searchData = data.filter((item) => {
			return (
				item.product_name.toLowerCase().includes(input.toLowerCase()) ||
				item.product_category.toLowerCase().includes(input.toLowerCase())
			);
		});

		SetFilteredProducts(searchData);
	};

	function ShowIngredientsComponent() {
		if (isLoading) {
			return (
				<ActivityIndicator
					animating={isLoading}
					size="large"
					color="black"
					style={styles.loadingAnimation}
				/>
			);
		} else {
			if (isViewing === "Ingredients") {
				return (
					<FlatList
						data={filteredIngredients}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<IngredientItemComponent
								name={item.ingredient_name}
								category={item.ingredient_category}
								quantity={item.ingredient_stock}
								unit_of_measurement={item.unit_of_measurement}
								imageURI={item.imageURI}
								stock_status={item.stock_status}
								handleButtonView={handleButtonView}
								handleButtonDelete={confirmDelete}
							/>
						)}
					/>
				);
			} else {
				return null;
			}
		}
	}

	function ShowProductsComponent() {
		if (isLoading) {
			return (
				<ActivityIndicator
					animating={isLoading}
					size="large"
					color="black"
					style={styles.loadingAnimation}
				/>
			);
		} else {
			if (isViewing === "Products") {
				return (
					<FlatList
						data={filteredProducts}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<ProductItemComponent
								name={item.product_name}
								category={item.product_category}
								quantity={item.product_quantity}
								quantities={item.product_quantities}
								sellingPrice={item.product_sellingPrice}
								imageURI={item.product_imageURI}
								handleButtonView={handleButtonView}
								handleButtonDelete={confirmDelete}
							/>
						)}
					/>
				);
			}
		}
	}

	return (
		<ImageBackground
			source={{
				uri: "https://i.pinimg.com/originals/6c/59/cd/6c59cd041f58cd43c9be81cfa2546f9d.jpg",
			}}
			resizeMode="cover"
			style={styles.container}
		>
			<View style={{ marginHorizontal: 5 }}>
				<Modal visible={modalOpen} animationType="slide">
					{isViewing == "Ingredients" ? (
						<AddIngredientModal
							closeModal={() => {
								SetModalOpen(false);
							}}
						/>
					) : (
						<AddProductModal
							closeModal={() => {
								SetModalOpen(false);
							}}
						/>
					)}
				</Modal>

				<Modal visible={viewModalOpen} animationType="slide">
					{isViewing == "Ingredients" ? (
						<ViewIngredientModal
							itemName={viewingItem}
							closeModal={() => {
								SetViewModalOpen(false);
							}}
						/>
					) : (
						<ViewProductModal
							itemName={viewingItem}
							closeModal={() => {
								SetViewModalOpen(false);
							}}
						/>
					)}
				</Modal>

				<View>
					<TextInput
						style={styles.searchBar}
						placeholder={
							isViewing == "Ingredients"
								? "Search ingredient..."
								: "Search products..."
						}
						onChangeText={(input) => {
							if (isViewing == "Ingredients") {
								SearchNameIngredient(input);
							} else {
								SearchNameProduct(input);
							}
						}}
					/>
					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}
					>
						<TouchableOpacity
							style={[
								styles.switchViewButtonContainer,
								{
									backgroundColor:
										isViewing === "Ingredients" ? "#1DC5DA" : "#DA321D",
								},
							]}
							onPress={() => {
								isViewing === "Ingredients"
									? SetIsViewing("Products")
									: SetIsViewing("Ingredients");
							}}
						>
							<Ionicons
								name={
									isViewing === "Ingredients"
										? "fast-food-outline"
										: "restaurant-outline"
								}
								size={22}
								color={"white"}
							/>
							<Text style={{ color: "white", marginLeft: 5 }}>
								{isViewing === "Ingredients"
									? "View Products"
									: "View Ingredients"}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.addItemButtonContainer}
							onPress={handleOpenModal}
						>
							<Ionicons name="add-outline" size={22} color={"white"} />
							<Text style={{ color: "white" }}>
								{isViewing == "Ingredients" ? "Add Ingredient" : "Add Product"}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			{isViewing === "Ingredients" ? (
				<ShowIngredientsComponent />
			) : (
				<ShowProductsComponent />
			)}
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#8966F8",
	},
	addItemButtonContainer: {
		flex: 0.4,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#67BA64",
		margin: 3,
		flexDirection: "row",
		padding: 4,
		borderWidth: 1,
		borderRadius: 12,
	},
	switchViewButtonContainer: {
		flex: 0.4,
		justifyContent: "center",
		alignItems: "center",
		margin: 3,
		flexDirection: "row",
		padding: 4,
		borderWidth: 1,
		borderRadius: 12,
	},
	loadingAnimation: {
		justifyContent: "center",
		alignSelf: "center",
	},
	searchBar: {
		width: "100%",
		height: 40,
		justifyContent: "center",
		backgroundColor: "#C0C0C0",
		borderRadius: 6,
		marginTop: 5,
		paddingHorizontal: 5,
	},
});

export default InventoryScreen;
