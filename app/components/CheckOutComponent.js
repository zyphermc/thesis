import React from "react";
import {
	Text,
	View,
	StyleSheet,
	Image,
	TouchableOpacity,
	Button,
	Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

function CheckOutComponent(props) {
	const { name, imageURI, quantity, sellingPrice, vat, size } = props;
	return (
		<View>
			{quantity > 0 ? (
				<View style={styles.container}>
					<View
						style={{
							flex: 1,
						}}
					>
						<Text>{quantity}</Text>
					</View>
					<View
						style={{
							flex: 1,
						}}
					>
						<Text>{size}</Text>
					</View>
					<View
						style={{
							flex: 2,
						}}
					>
						<Text>{name}</Text>
					</View>
					<View
						style={{
							flex: 1,
						}}
					>
						<Text>{quantity * sellingPrice}</Text>
					</View>
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
		marginBottom: 10,
		borderRadius: 10,
		borderColor: "black",
		marginLeft: 20,
	},
	image: {
		width: 90,
		height: 90,
	},
	textStyle: {
		width: 75,
		marginLeft: 10,
		fontWeight: "bold",
		fontSize: 15,
	},
});

export default CheckOutComponent;
