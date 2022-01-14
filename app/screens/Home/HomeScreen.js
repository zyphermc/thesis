import { React, useEffect, useState } from "react";
import {
	Text,
	StyleSheet,
	ImageBackground,
	Dimensions,
	Button,
	TouchableOpacity,
} from "react-native";

//Import Chart templates
import { LineChart, PieChart } from "react-native-chart-kit";

//Database
import {
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
	updateDoc,
	onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase-config";

function HomeScreen({ navigation, route }) {
	const [products, SetProducts] = useState([]);
	const [myPieData, SetMyPieData] = useState([]);
	const [fridayLineData, SetFridayLineData] = useState(0);
	//Database references
	const productsCollectionRef = collection(db, "products");

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

				docsSnapshot.docChanges().forEach(async (change) => {
					if (change.type === "added" || change.type === "modified") {
						let pieDataTemplate = {
							name: "",
							amount: "",
							color: generateColor(),
							legendFontColor: generateColor(),
							legendFontSize: 12,
						};
						let pieData = [];
						const GetItemSales = () => {
							let itemHistories = products.map(({ history }) => history);
							let totalItemsSold = 0;
							let filteredItems = itemHistories.map((itemHistoryArray) => {
								return itemHistoryArray.filter((itemHistory) => {
									return itemHistory.type == "Ordered";
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
											legendFontColor: generateColor(),
											legendFontSize: 12,
										};

										pieData.push(pieDataTemplate);
									}

									totalItemsSold += item.amount;
								});
							});
							SetFridayLineData(totalItemsSold);
							SetMyPieData(pieData);
						};

						GetItemSales();
					}
				});

				docsSnapshot.forEach((doc) => {
					myProducts.push(doc.data());
				});
				SetProducts(myProducts);
			});
		};

		getProducts();
	}, []);

	const UpdateGraphs = () => {
		let pieDataTemplate = {
			name: "",
			amount: "",
			color: generateColor(),
			legendFontColor: generateColor(),
			legendFontSize: 12,
		};
		let pieData = [];

		let itemHistories = products.map(({ history }) => history);
		let totalItemsSold = 0;
		let filteredItems = itemHistories.map((itemHistoryArray) => {
			return itemHistoryArray.filter((itemHistory) => {
				return itemHistory.type == "Ordered";
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
						legendFontColor: generateColor(),
						legendFontSize: 12,
					};

					pieData.push(pieDataTemplate);
				}

				totalItemsSold += item.amount;
			});
		});
		SetFridayLineData(totalItemsSold);
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

	return (
		<ImageBackground
			source={{
				uri: "https://i.pinimg.com/originals/6c/59/cd/6c59cd041f58cd43c9be81cfa2546f9d.jpg",
			}}
			style={styles.container}
		>
			<TouchableOpacity
				onPress={UpdateGraphs}
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
			<Text style={{ fontSize: 20, fontWeight: "100" }}>Sales Amount</Text>
			<LineChart
				data={{
					labels: ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"],
					datasets: [
						{
							data: [87, 74, 47, 35, fridayLineData, 0, 0],
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
