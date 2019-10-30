// ManageCategories.js
import React from 'react'
import {
    View,
    Text,
    Button,
    StyleSheet,
    AsyncStorage
} from 'react-native'
import Anchor from '../../anchor';

export default class ManageCategories extends React.Component {
    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Manage Categories'
                },
            }
        };
    }

    render() {
        return (
            <View style={styles.container}>

                <Text>Hello from Manage Categories screen.</Text>

            </View>
        )
    }
}
