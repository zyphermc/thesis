import React, { useState } from "react";
import { Text, StyleSheet, View} from "react-native";

function OrderScreen({ navigation, route }) {
	const [isAdmin] = useState(route.params.isAdmin);

	return (
		<View
		style = {{
			flex :1,
			backgroundColor: 'lightblue',
		}}
		>
		<Text style={{ justifyContent: "center", alignSelf: "center" }}>
			Order Screen
		</Text>
		</View>
	);
}

export default OrderScreen;
