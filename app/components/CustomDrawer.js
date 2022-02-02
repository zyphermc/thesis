import React, { useState, useEffect } from "react";
import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import { Image, ImageBackground, Text, View } from "react-native";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

//Firestore Database
import { getDoc, doc } from "firebase/firestore";
import { db, authentication } from "../../firebase-config";

function CustomDrawer(props) {
	const [userData, setUserData] = useState([]);
	const email = authentication.currentUser.email;

	useEffect(() => {
		const GetUserData = async (email) => {
			const emailDocSnap = await getDoc(doc(db, "emails", email));

			setUserData(emailDocSnap.data());
		};

		GetUserData(email);
	}, []);

	const user = userData.name;
	const isAdmin = userData.isAdmin;

	return (
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={{ backgroundColor: "#7289da" }}
			>
				<ImageBackground
					source={{
						uri: "https://images4.alphacoders.com/909/thumb-1920-909912.png",
					}}
					resizeMode="cover"
					style={{ flex: 1, padding: 30, marginTop: -10 }}
				>
					<Image
						source={{
							uri: "https://pickaface.net/gallery/avatar/20131229_235248_1095_snap.png",
						}}
						style={{
							height: 80,
							width: 80,
							borderRadius: 40,
							marginBottom: 10,
						}}
					/>
					<Text
						style={{
							color: "white",
							fontSize: 15,
						}}
					>
						Signed in as{" "}
						<Text style={{ color: "#99aab5" }}>
							{user} ({isAdmin ? "Admin" : "Staff"})
						</Text>
					</Text>
				</ImageBackground>
				<View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
					<DrawerItemList {...props} />
				</View>
			</DrawerContentScrollView>

			<View
				style={{
					flexDirection: "row",
					padding: 20,
					borderTopWidth: 1,
					borderTopColor: "#ccc",
					alignItems: "center",
				}}
			>
				<Ionicons name="business-outline" size={22} />
				<Text style={{ marginLeft: 10 }}>Computer Science Society</Text>
			</View>
		</View>
	);
}

export default CustomDrawer;
