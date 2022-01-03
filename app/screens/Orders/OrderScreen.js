import React from "react";
import { Text } from "react-native";

function OrderScreen({ navigation, route }) {
	const { isAdmin } = route.params;

	return (
		<Text style={{ justifyContent: "center", alignSelf: "center" }}>
			Order Screen
		</Text>
	);
}

export default OrderScreen;
