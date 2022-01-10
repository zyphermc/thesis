import React from "react";
import { Button, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import NavigationContainer from "@react-navigation/native";
import createMaterialTopTabNavigator from "@react-navigation/material-top-tabs";


function Cart() {
	<View
		style={{
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'cyan',
		}}
	>
		<Text>Cart Page</Text>
	</View>
}
function CheckOut() {
	<View
		style={{
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			backgroundColor: 'cyan',
		}}
	>
		<Text>CheckOut Page</Text>
	</View>
}

const Tab = createMaterialTopTabNavigator();

function CheckoutModal(props) {
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName="Cart"
				tabBarOptions={{
					activeTintColor: "cyan",
					labelStyle: { fontSize: 12 },
				}}
			>
				<Tab.Screen
					name="Cart"
					component={Cart}
					options={{ tabBarLabel: "Cart" }}
				/>
				<Tab.Screen
					name="CheckOut"
					component={CheckOut}
					options={{ tabBarLabel: "CheckOut" }}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	)
}

const styles = StyleSheet.create({
	closeButton: {
		position: "absolute",
		right: 10,
	},
})

export default CheckoutModal;
