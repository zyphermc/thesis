import React from "react";

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

//Screens
import LoginScreen from "../screens/Login/LoginScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import InventoryScreen from "../screens/Inventory/InventoryScreen";
import OrderScreen from "../screens/Orders/OrderScreen";
import CustomDrawer from "../components/CustomDrawer";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

const Stack = createNativeStackNavigator();

function StackNavigation(props) {
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen name={"Login"} component={LoginScreen} />
				<Stack.Screen name={"Drawer"} component={DrawerNavigation} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const Drawer = createDrawerNavigator();

function DrawerNavigation({ route }) {
	const params = route.params;

	return (
		<Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
			<Drawer.Screen
				name="Home"
				component={HomeScreen}
				initialParams={{ isAdmin: params.isAdmin }}
				options={{
					drawerIcon: (color) => (
						<Ionicons name="home-outline" size={22} color={color} />
					),
				}}
			/>
			<Drawer.Screen
				name="Inventory"
				component={InventoryScreen}
				initialParams={{ isAdmin: params.isAdmin }}
				options={{
					drawerIcon: (color) => (
						<Ionicons name="server-outline" size={22} color={color} />
					),
				}}
			/>
			{params.isAdmin ? (
				<Drawer.Screen
					name="Orders"
					component={OrderScreen}
					initialParams={{ isAdmin: params.isAdmin }}
					options={{
						drawerIcon: (color) => (
							<Ionicons name="fast-food-outline" size={22} color={color} />
						),
					}}
				/>
			) : (
				<></>
			)}
		</Drawer.Navigator>
	);
}

export default StackNavigation;
