import React from "react";
import { Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import TestScreen from "../screens/TestScreen";

const Stack = createNativeStackNavigator();

function Navigation(props) {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name={"Login"} component={LoginScreen} />
				<Stack.Screen name={"Test"} component={TestScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default Navigation;
