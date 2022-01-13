import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CartComponent from "../../components/CartComponent";

function Cart(props) {
	const { orderProductList } = props.route.params;
	const [totalValue, setTotalValue] = useState(0);

	let Tax = 0;
	let Subtotal = 0;

	Tax = totalValue * 0.12;
	Subtotal = totalValue - Tax;

	let cashTendered = "";

	const navigation = useNavigation();

	useEffect(() => {
		const getTotalValue = () => {
			let temp = 0;
			orderProductList.forEach((element) => {
				temp += element.sellingPrice * element.quantity;
			});
			setTotalValue(temp);
		};
		getTotalValue();
	}, []);

	const GetHeader = () => {
		return (
			<View
				style={{
					width: "100%",
					height: 30,
					backgroundColor: "black",
					justifyContent: "center",
				}}
			>
				<Text
					style={{
						fontSize: 18,
						fontWeight: "bold",
						color: "white",
						marginLeft: 100,
					}}
				>
					Product---Qty---Price---Total
				</Text>
			</View>
		);
	};

	const GetFooter = () => {
		return (
			<View>
				<View style={{ flex: 1 }}>
					<View
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							bottom: 0,
							height: 7,
							justifyContent: "center",
							backgroundColor: "orange",
						}}
					/>
				</View>
				<View
					style={{
						flex: 1,
						margin: 10,
						flexDirection: "row",
					}}
				>
					<View style={{ paddingRight: 15 }}>
						<Text style={styles.bottomText}>Subtotal:</Text>
						<Text style={styles.bottomText}>Tax (12%):</Text>
						<Text style={styles.bottomText}>Total: </Text>
						<Text style={styles.bottomText}>Cash tendered: </Text>
					</View>

					<View>
						<Text style={{ fontSize: 20 }}>₱{Subtotal.toFixed(2)}</Text>
						<Text style={{ fontSize: 20 }}>₱{Tax.toFixed(2)}</Text>
						<Text style={{ fontSize: 20 }}>₱{totalValue.toFixed(2)}</Text>
						<TextInput
							style={{ height: 30, width: 130, fontSize: 20 }}
							placeholder="Input Amount"
							onChangeText={(text) => (cashTendered = text)}
							defaultValue={cashTendered.toString()}
							keyboardType="number-pad"
						/>
					</View>

					<TouchableOpacity
						style={{
							position: "absolute",
							height: 35,
							width: 110,
							right: 6,
							borderRadius: 4,
							borderWidth: 2,
							borderColor: "black",
							backgroundColor: "orange",
							alignSelf: "center",
							alignItems: "center",
							justifyContent: "center",
						}}
						onPress={() => {
							if (cashTendered >= totalValue) {
								navigation.navigate("CheckOut", {
									orderProductList: orderProductList,
									Subtotal: Subtotal,
									Tax: Tax,
									totalValue: totalValue,
									cashTendered: parseInt(cashTendered),
								});
							} else {
								Alert.alert("Not enough cash!");
							}
						}}
					>
						<Text
							style={{
								textAlign: "center",
								fontWeight: "bold",
								fontSize: 16,
							}}
						>
							CHECKOUT
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	return (
		<View>
			<FlatList
				data={orderProductList}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => (
					<CartComponent
						name={item.productName}
						imageURI={item.imageURI}
						quantity={item.quantity}
						sellingPrice={item.sellingPrice}
						size={item.size}
						vat={item.vat}
					/>
				)}
				ListHeaderComponent={GetHeader}
				ListFooterComponent={GetFooter}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	bottomText: {
		fontSize: 20,
		fontWeight: "bold",
	},
});

export default Cart;
