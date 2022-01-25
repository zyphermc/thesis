import React from "react";
import Image from "react-native";

//Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

//Screens
import LoginScreen from "../screens/Login/LoginScreen";
import HomeScreen from "../screens/Home/HomeScreen";
import ReportsScreen from "../screens/Reports/ReportsScreen";
import InventoryScreen from "../screens/Inventory/InventoryScreen";
import OrderScreen from "../screens/Orders/OrderScreen";
import CustomDrawer from "../components/CustomDrawer";
import Cart from "../screens/Orders/Cart";
import CheckOut from "../screens/Orders/CheckOut";

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
				<Stack.Screen name={"Tab"} component={TabNavigation} />
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
			screenOptions={{
				headerStyle: {
					backgroundColor: "#f4511e",
				},
				headerTintColor: "#fff",
			}}
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
			<Drawer.Screen
				name="Reports"
				component={ReportsScreen}
				initialParams={{ isAdmin: isAdmin }}
				options={{
					drawerIcon: (color) => (
						<Ionicons name="bar-chart-outline" size={22} color={color} />
					),
				}}
			/>
		</Drawer.Navigator>
	);
}

const Tab = createMaterialTopTabNavigator();

function TabNavigation(props) {
	const { products, orderProductList } = props.route.params;
	return (
		<Tab.Navigator
			initialRouteName="Cart"
			screenOptions={{
				activeTintColor: "cyan",
				labelStyle: { fontSize: 12 },
				tabBarStyle: { marginTop: 20 },
			}}
		>
			<Tab.Screen
				name="Cart"
				component={Cart}
				initialParams={{
					products: products,
					orderProductList: orderProductList,
				}}
				options={{ tabBarLabel: "Cart", title: "Cart" }}
			/>
			<Tab.Screen
				name="CheckOut"
				component={CheckOut}
				initialParams={{ products: products }}
				options={{ tabBarLabel: "CheckOut", title: "CheckOut" }}
			/>
		</Tab.Navigator>
	);
}

export default StackNavigation;
