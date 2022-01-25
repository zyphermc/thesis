import React, { useState } from "react";
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
	const { name, imageURI, sellingPrice, size } = props;
	const [quantity, SetQuantity] = useState(props.quantity);
	return (
		<View>
			{quantity > 0 ? (
				<View style={styles.container}>
					<Image source={{ uri: imageURI }} style={styles.image} />
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

					<View style={{ position: "absolute", right: 5 }}>
						<TouchableOpacity
							onPress={() => {
								props.RemoveProductFromList(name);
								if (quantity > 0) {
									let tempQty = quantity;
									SetQuantity(--tempQty);
								}
							}}
						>
							<Ionicons name="remove-circle-outline" size={25} color={"red"} />
						</TouchableOpacity>
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
