import "react-native-gesture-handler";
import { SafeAreaView, StyleSheet, LogBox } from "react-native";

import Navigation from "./app/navigation";
import FlashMessage from "react-native-flash-message";

export default function App() {
	LogBox.ignoreLogs([
		"Setting a timer",
		"AsyncStorage has been extracted from react-native core and will be removed in a future release.",
		"Warning: Can't perform a React state update on an unmounted component.",
	]);

	return (
		<>
			<Navigation />
			<FlashMessage position="bottom" floating={true} icon={"auto"} />
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
		backgroundColor: "#FFF",
	},
});
