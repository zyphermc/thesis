import React, { useState, useEffect } from "react";
import { Text, View, Button, Image, FlatList, TouchableOpacity } from "react-native";
import CartComponent from "../../components/CartComponent";


function Cart(props) {

	const { orderProductList } = props.route.params;
	const [totalValue, setTotalValue] = useState(0)

	useEffect(() => {
		const getTotalValue = () => {
			let temp = 0
			orderProductList.forEach(element => {
				temp += element.sellingPrice * element.quantity
			});
			setTotalValue(temp)
		}
		getTotalValue();
	}, []);

	return (
		<View>
			<View>
				<View
					style={{
						width: "100%",
						height: 30,
						backgroundColor: 'black',
						justifyContent: 'center'
					}}
				>
					<Text
						style={{
							fontSize: 18,
							fontWeight: 'bold',
							color: 'white',
							marginLeft: 100
						}}
					>Product    Qty      Price       Total</Text>
				</View>
				<FlatList
					data={orderProductList}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ item }) => (
						<CartComponent
							name={item.productName}
							imageURI={item.imageURI}
							quantity={item.quantity}
							sellingPrice={item.sellingPrice}
							vat={item.vat}
						/>
					)}

				/>
			</View>
			<View style={{ flex: 1 }}>
				<View>
					<Text style={{ color: 'black' }}>HELLO WORLD</Text>
				</View>
				<View style={{
					position: 'absolute',
					left: 0,
					right: 0,
					bottom: 0,
					height: 30,
					justifyContent: 'center',
					backgroundColor: 'orange',
				}}>
					<Text
						style={{
							fontSize: 23,
							fontWeight: 'bold',
							alignSelf: 'flex-end',
							marginRight: 40
						}}
					>₱{totalValue}</Text>
				</View>
			</View>

			<TouchableOpacity
				style={{
					height: 25,
					width: 100,
					borderRadius: 20,
					borderWidth: 2,
					borderColor: 'black',
					backgroundColor: 'orange'
				}}
				onPress={() => (console.Console)}
			>
				<Text
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						textAlign: 'center',
						fontWeight: 'bold',
						fontSize: 15
					}}
				>CHECKOUT</Text>
			</TouchableOpacity>
		</View>

	);
}

export default Cart;
