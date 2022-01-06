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
			<Stack.Navigator
				screenOptions={{ headerShown: false }}
				initialRouteName="Login"
			>
				<Stack.Screen name={"Login"} component={LoginScreen} />
				<Stack.Screen name={"Drawer"} component={DrawerNavigation} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const Drawer = createDrawerNavigator();

function DrawerNavigation(props) {
	const { isAdmin } = props.route.params;

	return (
		<Drawer.Navigator
			drawerContent={(props) => <CustomDrawer {...props} />}
			initialRouteName="Home"
		>
			<Drawer.Screen
				name="Home"
				component={HomeScreen}
				initialParams={{ isAdmin: isAdmin }}
				options={{
					drawerIcon: (color) => (
						<Ionicons name="home-outline" size={22} color={color} />
					),
				}}
			/>

			{isAdmin ? (
				<Drawer.Screen
					name="Inventory"
					component={InventoryScreen}
					initialParams={{ isAdmin: isAdmin }}
					options={{
						drawerIcon: (color) => (
							<Ionicons name="server-outline" size={22} color={color} />
						),
					}}
				/>
			) : (
				<></>
			)}
			<Drawer.Screen
				name="Point of Sale"
				component={OrderScreen}
				initialParams={{ isAdmin: isAdmin }}
				options={{
					drawerIcon: (color) => (
						<Ionicons name="fast-food-outline" size={22} color={color} />
					),
				}}
			/>
		</Drawer.Navigator>
	);
}

export default StackNavigation;
