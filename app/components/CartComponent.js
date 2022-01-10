import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";

function CartComponent(props) {
    const { name, imageURI, quantity, sellingPrice, vat } = props
    return (
        <View
            style={{
                flex: 1
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    marginBottom: 10
                }}
            >
                <Image
                    source={{ uri: props.imageURI }}
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 30,
                    }}
                />
                <Text
                    style={{
                        marginLeft: 10
                    }}
                >{name}</Text>
                <Text
                    style={{
                        marginLeft: 10
                    }}
                >{quantity}</Text>
                <Text
                    style={{
                        marginLeft: 10
                    }}
                >{sellingPrice}</Text>
                <Text
                    style={{
                        marginLeft: 30
                    }}
                >
                    {sellingPrice * quantity}
                </Text>
            </View>
        </View>
    )
}

export default CartComponent;