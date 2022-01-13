import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function CheckOut(props) {
	const { orderProductList, cashTendered, Tax, Subtotal, totalValue } =
		props.route.params;

	const navigation = useNavigation();

	return (
		<View style={{ flex: 1 }}>
			<View>
				<View
					style={{
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<TouchableOpacity
						style={{
							height: 50,
							width: 50,
						}}
						onPress={() => {
							navigation.navigate("Point of Sale");
						}}
					>
						<Image
							source={require("../../assets/images/logo.png")}
							style={{
								height: 50,
								width: 50,
							}}
						/>
					</TouchableOpacity>

					<Text
						style={{
							fontSize: 15,
						}}
					>
						Santo Domingo Albay
					</Text>
				</View>
			</View>
			<View
				style={{
					flexDirection: "row",
				}}
			>
				<View style={{ flex: 1 }}>
					<Text>Qty</Text>
				</View>
				<View style={{ flex: 1 }}>
					<Text>Size</Text>
				</View>
				<View style={{ flex: 2 }}>
					<Text>Product</Text>
				</View>
				<View style={{ flex: 1 }}>
					<Text>Total</Text>
				</View>
			</View>
			<View>
				<Text>===================================================</Text>
				<View
					style={{
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text style={{ flex: 0.3 }}>Subtotal</Text>
						<Text>989</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text style={{ flex: 0.3 }}>Tax</Text>
						<Text>12.5</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text style={{ flex: 0.3 }}>Total</Text>
						<Text>1000</Text>
					</View>
					<Text>===================================================</Text>
					<View
						style={{
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Text style={{ flex: 0.3 }}>Cash</Text>
							<Text>1000</Text>
						</View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Text style={{ flex: 0.3 }}>Change</Text>
							<Text>11</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}

export default CheckOut;
