import { React, useEffect, useState } from "react";
import {
	Text,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TouchableOpacity,
} from "react-native";

//Import Chart templates
import { LineChart, PieChart } from "react-native-chart-kit";

//Database
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase-config";

function HomeScreen({ navigation, route }) {
	const [products, SetProducts] = useState([]);
	const [myPieData, SetMyPieData] = useState([]);
	const [myLineData, SetMyLineData] = useState([0]);

	//daily, weekly, monthly
	const [lineChartTimeframe, SetLineChartTimeframe] = useState("daily");
	//today, this week, this month, this year [today, week, month, year]
	const [pieChartTimeframe, SetPieChartTimeframe] = useState("today");

	//Database references
	const productsCollectionRef = collection(db, "products");

	//A function that returns a randomly generated color
	const generateColor = () => {
		const randomColor = Math.floor(Math.random() * 16777215)
			.toString(16)
			.padStart(6, "0");
		return `#${randomColor}`;
	};

	useEffect(() => {
		//Get Products from Firestore
		const getProducts = async () => {
			const unsub = onSnapshot(productsCollectionRef, (docsSnapshot) => {
				const myProducts = [];

				docsSnapshot.forEach((doc) => {
					myProducts.push(doc.data());
				});

				docsSnapshot.docChanges().forEach(async (change) => {
					if (change.type === "added" || change.type === "modified") {
						UpdatePieChart(myProducts, pieChartTimeframe);
						UpdateLineChart(myProducts, lineChartTimeframe);
					}
				});

				SetProducts(myProducts);
			});
		};

		getProducts();
	}, []);

	Date.prototype.addDays = function (days) {
		var date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	};

	const UpdateLineChart = (productsData, lineChartTimeframe) => {
		let itemHistories = productsData.map(({ history }) => history);

		//Return ordered items that fit timeframe
		let filteredItems = itemHistories.map((itemHistoryArray) => {
			return itemHistoryArray.filter((itemHistory) => {
				if (lineChartTimeframe == "daily") {
					let d = new Date();
					let dateArray = [];

					for (let a = 6; a >= 0; a--) {
						dateArray.push(d.addDays(-a).getDate());
					}

					return (
						itemHistory.type == "Ordered" &&
						dateArray.includes(parseInt(itemHistory.date.split("-")[2]))
					);
				} else if (lineChartTimeframe == "weekly") {
					return (
						itemHistory.type == "Ordered" &&
						itemHistory.date.split("-")[1] == new Date().getMonth() + 1
					);
				} else if (lineChartTimeframe == "monthly") {
					return (
						itemHistory.type == "Ordered" &&
						itemHistory.date.split("-")[0] == new Date().getFullYear()
					);
				}
			});
		});

		let tempLineDataDaily = [0, 0, 0, 0, 0, 0, 0];
		let tempLineDataWeekly = [0, 0, 0, 0];
		let tempLineDataMonthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		filteredItems.map((items) => {
			items.map((item) => {
				if (lineChartTimeframe == "daily") {
					const tempDate = new Date(item.date.replace(/-/g, "/"));

					tempLineDataDaily[tempDate.getDay()] += item.amount;
				} else if (lineChartTimeframe == "weekly") {
					if (item.date.split("-")[2] <= 7) {
						tempLineDataWeekly[0] += item.amount;
					} else if (item.date.split("-")[2] <= 14) {
						tempLineDataWeekly[1] += item.amount;
					} else if (item.date.split("-")[2] <= 21) {
						tempLineDataWeekly[2] += item.amount;
					} else if (item.date.split("-")[2] <= 31) {
						tempLineDataWeekly[3] += item.amount;
					}
				} else if (lineChartTimeframe == "monthly") {
					const tempDate = new Date(item.date.replace(/-/g, "/"));
					tempLineDataMonthly[tempDate.getMonth()] += item.amount;
				}
			});
		});

		if (lineChartTimeframe == "daily") {
			SetMyLineData(tempLineDataDaily);
		} else if (lineChartTimeframe == "weekly") {
			SetMyLineData(tempLineDataWeekly);
		} else if (lineChartTimeframe == "monthly") {
			SetMyLineData(tempLineDataMonthly);
		}
	};
	const UpdatePieChart = (productsData, pieChartTimeframe) => {
		let pieDataTemplate = {
			name: "",
			amount: "",
			color: "",
			legendFontColor: "",
			legendFontSize: 12,
		};
		let pieData = [];

		let itemHistories = productsData.map(({ history }) => history);

		//Return ordered items that fit timeframe
		let filteredItems = itemHistories.map((itemHistoryArray) => {
			return itemHistoryArray.filter((itemHistory) => {
				if (pieChartTimeframe == "today") {
					return (
						itemHistory.type == "Ordered" &&
						itemHistory.date.split("-")[2] == new Date().getDate()
					);
				} else if (pieChartTimeframe == "week") {
					let d = new Date();
					let dateArray = [];

					for (let a = 6; a >= 0; a--) {
						dateArray.push(d.addDays(-a).getDate());
					}

					return (
						itemHistory.type == "Ordered" &&
						dateArray.includes(parseInt(itemHistory.date.split("-")[2]))
					);
				} else if (pieChartTimeframe == "month") {
					return (
						itemHistory.type == "Ordered" &&
						itemHistory.date.split("-")[1] == new Date().getMonth() + 1
					);
				} else if (pieChartTimeframe == "year") {
					return (
						itemHistory.type == "Ordered" &&
						itemHistory.date.split("-")[0] == new Date().getFullYear()
					);
				}
			});
		});

		filteredItems.map((items) => {
			items.map((item) => {
				//Check if already in list
				const itemIndex = pieData.findIndex((myItem) => {
					return myItem.name.includes(item.name);
				});

				if (itemIndex != -1) {
					pieData[itemIndex].amount += item.amount;
				} else {
					pieDataTemplate = {
						name: item.name,
						amount: item.amount,
						color: generateColor(),
						legendFontColor: "black",
						legendFontSize: 12,
					};

					pieData.push(pieDataTemplate);
				}
			});
		});

		SetMyPieData(pieData);
	};

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

	const timeframeLabels = () => {
		if (lineChartTimeframe == "daily") {
			return ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
		} else if (lineChartTimeframe == "weekly") {
			return ["1-7", "8-14", "15-21", "22-31"];
		} else if (lineChartTimeframe == "monthly") {
			return [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"June",
				"July",
				"Aug",
				"Sept",
				"Oct",
				"Nov",
				"Dec",
			];
		}
	};

	const Capitalize = (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	return (
		<ImageBackground
			source={{
				uri: "https://i.pinimg.com/originals/6c/59/cd/6c59cd041f58cd43c9be81cfa2546f9d.jpg",
			}}
			style={styles.container}
		>
			<TouchableOpacity
				onPress={() => {
					UpdateLineChart(products, lineChartTimeframe);
					UpdatePieChart(products, pieChartTimeframe);
				}}
				style={{
					position: "absolute",
					right: 5,
					height: 30,
					width: 90,
					borderWidth: 1,
					backgroundColor: "#fff",
					borderColor: "orange",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>UPDATE</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => {
					if (lineChartTimeframe == "daily") {
						SetLineChartTimeframe("weekly");
						UpdateLineChart(products, "weekly");
					} else if (lineChartTimeframe == "weekly") {
						SetLineChartTimeframe("monthly");
						UpdateLineChart(products, "monthly");
					} else if (lineChartTimeframe == "monthly") {
						SetLineChartTimeframe("daily");
						UpdateLineChart(products, "daily");
					}
				}}
				style={{
					position: "absolute",
					top: 3,
					left: 35,
					height: 30,
					width: 90,
					borderWidth: 1,
					backgroundColor: "#10bfef",
					borderColor: "orange",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>{Capitalize(lineChartTimeframe)}</Text>
			</TouchableOpacity>
			<Text style={{ fontSize: 20, fontWeight: "100" }}>Sales Amount</Text>
			<LineChart
				data={{
					labels: timeframeLabels(),
					datasets: [
						{
							data: myLineData,
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

			<TouchableOpacity
				onPress={() => {
					if (pieChartTimeframe == "today") {
						SetPieChartTimeframe("week");
						UpdatePieChart(products, "week");
					} else if (pieChartTimeframe == "week") {
						SetPieChartTimeframe("month");
						UpdatePieChart(products, "month");
					} else if (pieChartTimeframe == "month") {
						SetPieChartTimeframe("year");
						UpdatePieChart(products, "year");
					} else if (pieChartTimeframe == "year") {
						SetPieChartTimeframe("today");
						UpdatePieChart(products, "today");
					}
				}}
				style={{
					position: "absolute",
					top: 338,
					left: 35,
					height: 30,
					width: 90,
					borderWidth: 1,
					backgroundColor: "#10bfef",
					borderColor: "orange",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>{Capitalize(pieChartTimeframe)}</Text>
			</TouchableOpacity>

			<PieChart
				data={myPieData}
				width={Dimensions.get("window").width}
				height={300}
				chartConfig={myChartConfig}
				accessor={"amount"}
				backgroundColor={"orange"}
				paddingLeft={"0"}
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
