import React, { useState, useEffect } from "react";
import { Text, View, Button, Image, FlatList } from "react-native";
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
			<Text>{totalValue}</Text>
		</View>
	);
}

export default Cart;
