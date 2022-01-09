import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	ImageBackground,
	Image,
} from "react-native";

import { doc, onSnapshot, updateDoc } from "firebase/firestore";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

//Forms
import { Formik } from "formik";

import { db } from "../../../../firebase-config";

function ViewProductModal(props) {
	console.log(props.itemName);

	return (
		<ImageBackground
			source={{
				uri: "https://i.ibb.co/4Vzwdcc/Pngtree-milk-tea-shop-poster-background-1021135.jpg",
			}}
			resizeMode="cover"
			style={styles.container}
		>
			<TouchableOpacity style={styles.closeButton} onPress={props.closeModal}>
				<Ionicons name="close-outline" size={40} color={"black"} />
			</TouchableOpacity>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 5,
	},
	closeButton: {
		position: "absolute",
		right: 10,
	},
});
export default ViewProductModal;
