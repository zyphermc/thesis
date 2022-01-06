import "react-native-gesture-handler";
import { SafeAreaView, StyleSheet, LogBox } from "react-native";

import Navigation from "./app/Navigation";

//Test Environment for testing features
import Test from "./app/screens/Test";

export default function App() {
	LogBox.ignoreLogs([
		"Setting a timer",
		"AsyncStorage has been extracted from react-native core and will be removed in a future release.",
	]);

	return (
		<SafeAreaView style={styles.container}>
			<Navigation />
			{/* <Test /> */}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
		backgroundColor: "#FFF",
	},
});
