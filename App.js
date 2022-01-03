import "react-native-gesture-handler";
import { SafeAreaView, StyleSheet, LogBox } from "react-native";

import Navigation from "./app/Navigation";

export default function App() {
	LogBox.ignoreLogs([
		"AsyncStorage has been extracted from react-native core and will be removed in a future release.",
	]);

	return (
		<SafeAreaView style={styles.container}>
			<Navigation />
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
