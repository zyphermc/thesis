import { React, useState } from "react";
import {
	Text,
	View,
	StyleSheet,
	ImageBackground,
	Dimensions,
} from "react-native";

//Import Chart templates
import {
	LineChart,
	BarChart,
	PieChart,
	ProgressChart,
	ContributionGraph,
	StackedBarChart,
} from "react-native-chart-kit";

function HomeScreen({ navigation, route }) {
	const pieData = [
		{
			name: "Oreo Milkshake",
			amount: 185,
			color: "rgba(131, 167, 234, 1)",
			legendFontColor: "#7F7F7F",
			legendFontSize: 12,
		},
		{
			name: "Carbonara",
			amount: 80,
			color: "#F00",
			legendFontColor: "#7F7F7F",
			legendFontSize: 12,
		},
	];

	const myChartConfig = {
		backgroundColor: "#e26a00",
		backgroundGradientFrom: "#fb8c00",
		backgroundGradientTo: "#ffa726",
		color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		style: {
			borderRadius: 24,
			flex: 1,
		},
	};

	return (
		<ImageBackground
			source={{
				uri: "https://i.pinimg.com/originals/6c/59/cd/6c59cd041f58cd43c9be81cfa2546f9d.jpg",
			}}
			style={styles.container}
		>
			<Text style={{ fontSize: 20, fontWeight: "100" }}>Sales Amount</Text>
			<LineChart
				data={{
					labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
					datasets: [
						{
							data: [31, 25, 13, 52, 21, 66, 57],
						},
					],
				}}
				width={Dimensions.get("window").width} // from react-native
				height={300}
				yAxisInterval={1} // optional, defaults to 1
				chartConfig={{
					backgroundColor: "#e26a00",
					backgroundGradientFrom: "#fb8c00",
					backgroundGradientTo: "#ffa726",
					decimalPlaces: 0, // optional, defaults to 2dp
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					style: {
						borderRadius: 16,
					},
					propsForDots: {
						r: "6",
						strokeWidth: "2",
						stroke: "#4E2ED1",
					},
				}}
				bezier
				style={{
					marginVertical: 8,
					borderRadius: 16,
				}}
			/>
			<Text style={{ fontSize: 20, fontWeight: "100" }}>Products Sold</Text>
			<PieChart
				data={pieData}
				width={Dimensions.get("window").width}
				height={300}
				chartConfig={myChartConfig}
				accessor={"amount"}
				backgroundColor={"orange"}
				paddingLeft={"25"}
				center={[0, 0]}
				absolute
				style={{ borderRadius: 24 }}
			/>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
});

export default HomeScreen;
