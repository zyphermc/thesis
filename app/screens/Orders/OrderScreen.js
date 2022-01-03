import React, { useState } from "react";
import { Text } from "react-native";

function OrderScreen({ navigation, route }) {
	const [isAdmin] = useState(route.params.isAdmin);

	return (
		<Text style={{ justifyContent: "center", alignSelf: "center" }}>
			Order Screen
		</Text>
	);
}

export default OrderScreen;
