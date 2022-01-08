import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

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

//THIS SHOULD ACCEPT PRODUCT NAME PROP TO ACCESS DOCUMENT FROM FIRESTORE

function ViewProductModal(props) {
	console.log(props.itemName);

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.closeButton} onPress={props.closeModal}>
				<Ionicons name="close-outline" size={40} color={"black"} />
			</TouchableOpacity>
		</View>
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
