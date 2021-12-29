import { View, Text, SafeAreaView, StyleSheet } from "react-native";

import Navigation from "./app/navigation/navigation";

export default function App() {
	return (
		<View style={styles.container}>
			<Navigation />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
		backgroundColor: "#FFF",
	},
});
