import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	StyleSheet,
	Image,
	TouchableOpacity,
	Button,
	Alert,
	DeviceEventEmitter,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import Ionicons from "react-native-vector-icons/Ionicons";

function CartComponent(props) {
	const { name, imageURI, sellingPrice, size } = props;
	const [quantity, SetQuantity] = useState(props.quantity);

	useEffect(() => {
		return () => {
			//DeviceEventEmitter.removeAllListeners("addItemsLocally");
		};
	}, []);

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
								props.RemoveProductFromList(name, size);

								if (quantity > 0) {
									let tempQty = quantity;
									SetQuantity(--tempQty);
									let data = [name, 1, size];
									DeviceEventEmitter.emit("addItemsLocally", { data });

									if (size != "") {
										showMessage({
											message: `Successfully removed 1 ${size} ${name}`,
											type: "success",
										});
									} else {
										showMessage({
											message: `Successfully removed 1 ${name}`,
											type: "success",
										});
									}
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
