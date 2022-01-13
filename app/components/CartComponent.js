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

function CartComponent(props) {
	const { name, imageURI, quantity, sellingPrice, vat, size } = props;
	return (
		<View>
			<View style={styles.container}>
				<Image source={{ uri: props.imageURI }} style={styles.image} />
				<Text style={styles.textStyle}>
					{name} {size}
				</Text>
				<Text
					style={{
						marginLeft: 15,
						fontWeight: "bold",
						fontSize: 15,
					}}
				>
					{quantity}
				</Text>
				<Text
					style={{
						marginLeft: 45,
						fontWeight: "bold",
						fontSize: 15,
					}}
				>
					{sellingPrice}
				</Text>
				<Text
					style={{
						marginLeft: 42,
						fontWeight: "bold",
						fontSize: 15,
					}}
				>
					{quantity * sellingPrice}
				</Text>
			</View>
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

export default CartComponent;
