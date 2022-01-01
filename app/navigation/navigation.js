import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/Login/LoginScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import InventoryScreen from "../screens/Inventory/InventoryScreen";

const Stack = createNativeStackNavigator();

function Navigation(props) {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name={"Login"} component={LoginScreen} />
				<Stack.Screen name={"Home"} component={HomeScreen} />
				<Stack.Screen name={"Inventory"} component={InventoryScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default Navigation;
