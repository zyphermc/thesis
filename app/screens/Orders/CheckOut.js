import React, { useState, useEffect } from "react";
import { Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CheckOutComponent from "../../components/CheckOutComponent";
import moment from "moment";

function CheckOut(props) {
	const { orderProductList, cashTendered, Tax, Subtotal, totalValue } =
		props.route.params;

	const navigation = useNavigation();

	const [currentDate, setCurrentDate] = useState("");

	useEffect(() => {
		var date = moment().utcOffset("+08:00").format(" MMMM/DD/YYYY ,hh:mm:ss a");
		setCurrentDate(date);
	}, []);

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
					<Text>{currentDate}</Text>
				</View>
			</View>
			<View
				style={{
					flexDirection: "row",
					marginLeft: 20,
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
				<View>
					<FlatList
						data={orderProductList}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => (
							<CheckOutComponent
								name={item.productName}
								quantity={item.quantity}
								sellingPrice={item.sellingPrice}
								size={item.size}
							/>
						)}
					/>
				</View>

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
						<Text>
							{typeof Subtotal != "undefined" ? Subtotal.toFixed(2) : Subtotal}
						</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text style={{ flex: 0.3 }}>Tax</Text>
						<Text>{typeof Tax != "undefined" ? Tax.toFixed(2) : Tax}</Text>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text style={{ flex: 0.3 }}>Total</Text>
						<Text>
							{typeof totalValue != "undefined"
								? totalValue.toFixed(2)
								: totalValue}
						</Text>
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
							}}
						>
							<Text style={{ flex: 0.4 }}>Cash</Text>
							<Text>
								{typeof cashTendered != "undefined"
									? cashTendered.toFixed(2)
									: cashTendered}
							</Text>
						</View>
						<View
							style={{
								flexDirection: "row",
							}}
						>
							<Text style={{ flex: 0.4 }}>Change</Text>
							<Text>{(cashTendered - totalValue).toFixed(2)}</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
}

export default CheckOut;
