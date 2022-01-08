import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	StyleSheet,
	ImageBackground,
} from "react-native";

import {
	collection,
	doc,
	deleteDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";

//Icons
import Ionicons from "react-native-vector-icons/Ionicons";

import { db } from "../../../../firebase-config";

//THIS SHOULD ACCEPT INGREDIENT NAME PROP TO ACCESS DOCUMENT FROM FIRESTORE

function ViewIngredientModal(props) {
	console.log(props.itemName);

	return (
		<ImageBackground
			source={{
				uri: "https://png.pngtree.com/thumb_back/fh260/back_our/20190620/ourmid/pngtree-milk-tea-shop-poster-background-material-image_150838.jpg",
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
	},
	closeButton: {
		position: "absolute",
		right: 10,
	},
});

export default ViewIngredientModal;
