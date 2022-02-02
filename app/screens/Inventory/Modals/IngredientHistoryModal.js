import React from "react";
import {
	StyleSheet,
	TextInput,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Button,
} from "react-native";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

function IngredientHistoryModal(props) {
	const ingredientHistories = props.ingredientData.history;

	return (
		<ScrollView style={styles.container}>
			<Text
				style={{
					marginTop: 10,
					marginLeft: 5,
					fontSize: 24,
					fontWeight: "bold",
					justifyContent: "center",
				}}
			>
				History Log:
			</Text>

			<TouchableOpacity style={styles.closeButton} onPress={props.CloseModal}>
				<Ionicons name="close-outline" size={40} color={"black"} />
			</TouchableOpacity>

			<View style={{ marginTop: 5 }}>
				{ingredientHistories
					.slice(0)
					.reverse()
					.map((entry, index) => {
						return (
							<View key={index} style={styles.component}>
								<Text style={styles.logText}>Type: {entry.type}</Text>
								<Text style={styles.logText}>Name: {entry.name}</Text>
								<Text style={styles.logText}>
									Amount: {entry.amount}{" "}
									{props.ingredientData.unit_of_measurement}
								</Text>
								{entry.type === "Restock" || entry.type === "Initialized" ? (
									<View>
										<Text style={styles.logText}>Price: {entry.price}</Text>
										<Text style={styles.logText}>
											Supplier: {entry.supplier}
										</Text>
									</View>
								) : (
									<></>
								)}
								<Text style={styles.logText}>Date: {entry.date}</Text>
							</View>
						);
					})}
			</View>
		</ScrollView>
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
	component: {
		padding: 10,
		margin: 5,
		borderWidth: 1,
		borderColor: "black",
	},
	logText: {
		fontSize: 16,
	},
});

export default IngredientHistoryModal;
