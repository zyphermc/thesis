import { React, useEffect, useState } from "react";
import {
	Text,
	StyleSheet,
	ImageBackground,
	Dimensions,
	TouchableOpacity,
	ScrollView,
	View,
} from "react-native";

//Import Chart templates
import { LineChart, PieChart } from "react-native-chart-kit";

//Notifications
import { showMessage } from "react-native-flash-message";

//Database
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase-config";

function HomeScreen({ navigation, route }) {
	const [products, SetProducts] = useState([]);
	const [myPieData, SetMyPieData] = useState([]);
	const [myLineData, SetMyLineData] = useState([0]);

	//daily, weekly, monthly
	const [lineChartTimeframe, SetLineChartTimeframe] = useState("daily");
	const monthList = [
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

	const monthListFull = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	//today, this week, this month, this year [today, week, month, year]
	const [pieChartTimeframe, SetPieChartTimeframe] = useState("today");

	//Database references
	const productsCollectionRef = collection(db, "products");

	//Starting and Ending Dates
	const [dateToday, SetDateToday] = useState("");
	const [weekRange, SetWeekRange] = useState("");
	const [monthToday, SetMonthToday] = useState("");
	const [yearToday, SetYearToday] = useState("");

	//Get Starting and Ending Week Date
	const GetDatesToday = () => {
		//Get date today
		let tempDateToday = new Date();
		SetDateToday(tempDateToday.toLocaleDateString());

		//Get week range
		let curr = new Date();
		let week = [];

		for (let i = 0; i < 7; i++) {
			let first = curr.getDate() - curr.getDay() + i;
			let day = new Date(curr.setDate(first)).toLocaleDateString();

			week.push(day);
		}
		const myWeekRange = `${week[0]} - ${week[week.length - 1]}`;
		SetWeekRange(myWeekRange);

		//Get Month today
		SetMonthToday(monthListFull[tempDateToday.getMonth()]);

		//Get Year today
		SetYearToday(tempDateToday.getFullYear());
	};

	const GetTimeframeDate = () => {
		if (pieChartTimeframe == "today") {
			return dateToday;
		} else if (pieChartTimeframe == "week") {
			return weekRange;
		} else if (pieChartTimeframe == "month") {
			return monthToday;
		} else if (pieChartTimeframe == "year") {
			return yearToday;
		}
	};

	//Export data into excel or CSV
	const exportData = (type) => {
		if (type == "excel") {
			//do stuff
		} else if (type == "csv") {
			//doo stuff
		}
	};

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

		GetDatesToday();
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

		//Get today and 6 days before
		let d = new Date();
		let dateArray = [];

		for (let a = 6; a >= 0; a--) {
			dateArray.push(d.addDays(-a).toLocaleDateString());
		}

		filteredItems.map((items) => {
			items.map((item) => {
				if (lineChartTimeframe == "daily") {
					const itemDate = new Date(
						item.date.replace(/-/g, "/")
					).toLocaleDateString();

					const dateIndex = dateArray.indexOf(itemDate);

					if (dateIndex >= 0) {
						tempLineDataDaily[dateIndex] += item.totalValue;
					}
				} else if (lineChartTimeframe == "weekly") {
					if (item.date.split("-")[2] <= 7) {
						tempLineDataWeekly[0] += item.totalValue;
					} else if (item.date.split("-")[2] <= 14) {
						tempLineDataWeekly[1] += item.totalValue;
					} else if (item.date.split("-")[2] <= 21) {
						tempLineDataWeekly[2] += item.totalValue;
					} else if (item.date.split("-")[2] <= 31) {
						tempLineDataWeekly[3] += item.totalValue;
					}
				} else if (lineChartTimeframe == "monthly") {
					const tempDate = new Date(item.date.replace(/-/g, "/"));
					tempLineDataMonthly[tempDate.getMonth()] += item.totalValue;
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

		//Get days of this week
		let curr = new Date();
		let week = [];

		for (let i = 0; i < 7; i++) {
			let first = curr.getDate() - curr.getDay() + i;
			let day = new Date(curr.setDate(first)).toLocaleDateString();

			week.push(day);
		}

		//Return ordered items that fit timeframe
		let filteredItems = itemHistories.map((itemHistoryArray) => {
			return itemHistoryArray.filter((itemHistory) => {
				if (pieChartTimeframe == "today") {
					return (
						itemHistory.type == "Ordered" &&
						itemHistory.date.split("-")[2] == new Date().getDate()
					);
				} else if (pieChartTimeframe == "week") {
					const itemDate = new Date(
						itemHistory.date.replace(/-/g, "/")
					).toLocaleDateString();

					return itemHistory.type == "Ordered" && week.includes(itemDate);
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

	const timeframeLabels = () => {
		if (lineChartTimeframe == "daily") {
			//Get today and 6 days before
			let d = new Date();
			let dateArray = [];

			for (let a = 6; a >= 0; a--) {
				dateArray.push(d.addDays(-a).toLocaleDateString().slice(0, 5));
			}

			return dateArray;
		} else if (lineChartTimeframe == "weekly") {
			const curr = new Date();
			const monthIndex = curr.getMonth();

			return [
				`${monthList[monthIndex]} 1-7`,
				`${monthList[monthIndex]} 8-14`,
				`${monthList[monthIndex]} 15-21`,
				`${monthList[monthIndex]} 22-31`,
			];
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
			style={{ flex: 1 }}
		>
			<ScrollView>
				<View style={styles.container}>
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
							top: 10,
							left: 15,
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
					<Text style={{ fontSize: 20, fontWeight: "100" }}>
						Sales Amount (₱)
					</Text>
					<Text style={{ fontSize: 12, fontWeight: "100" }}>
						{lineChartTimeframe != "yearly" ? "(2022)" : null}
					</Text>

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
						onDataPointClick={(data) => {
							showMessage({
								message: `Sales Value: ₱${data.value}`,
								type: "info",
							});
						}}
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
					<Text
						style={{ fontSize: 12, fontWeight: "100", marginBottom: 5 }}
					>{`(${GetTimeframeDate()})`}</Text>
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
							top: 360,
							left: 15,
							height: 30,
							width: 90,
							borderWidth: 1,
							backgroundColor: "#10bfef",
							borderColor: "orange",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text>
							{pieChartTimeframe != "today" ? "This" : null}{" "}
							{Capitalize(pieChartTimeframe)}
						</Text>
					</TouchableOpacity>
					<PieChart
						data={myPieData}
						width={Dimensions.get("window").width}
						height={250}
						chartConfig={{
							backgroundColor: "#e26a00",
							backgroundGradientFrom: "#fb8c00",
							backgroundGradientTo: "#ffa726",
							color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
							labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						}}
						accessor={"amount"}
						backgroundColor={"orange"}
						paddingLeft={"-5"}
						center={[15, 0]}
						absolute
						style={{ borderRadius: 24 }}
					/>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-evenly",
							marginHorizontal: 50,
							marginVertical: 5,
						}}
					>
						<TouchableOpacity
							onPress={() => {
								exportData("excel");
							}}
							style={styles.exportButton}
						>
							<Text style={{ color: "white" }}>Export Data as Excel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								exportData("csv");
							}}
							style={styles.exportButton}
						>
							<Text style={{ color: "white" }}>Export Data as CSV</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	exportButton: {
		height: 50,
		width: 150,
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 25,
		backgroundColor: "#644A33",
		borderColor: "#e26a00",
		borderWidth: 2,
		borderRadius: 20,
	},
});

export default HomeScreen;
