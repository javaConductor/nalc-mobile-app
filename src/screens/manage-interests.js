// ManageInterests.js
import React from 'react'
import {
    View,
    Text,
    Button,
    StyleSheet,
    AsyncStorage
} from 'react-native'
import Anchor from '../components/anchor';

export default class ManageInterests extends React.Component {
    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Manage Interests'
                },
            }
        };
    }

    render() {
        return (
            <View style={styles.container}>

                <Text>Hello from Manage Interests screen.</Text>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});