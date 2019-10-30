// Admin.js
import React from 'react'
import {
    View,
    Text,
    Button,
    StyleSheet,
    AsyncStorage
} from 'react-native'
import Anchor from '../anchor';

//..import { goToAuth } from './navigation';
//import {Navigation} from 'react-native-navigation';

import { USER_KEY } from '../config';

export default class Admin extends React.Component {
    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Admin'
                },
            }
        };
    }
    logout = async () => {
        try {
            await AsyncStorage.removeItem(USER_KEY);
            //goToAuth()
        } catch (err) {
            console.log('error signing out...: ', err)
        }
    };
    render() {
        return (
            <View style={styles.container}>

                <Button
                    onPress={() => {
                        Navigation.push(this.props.componentId, {
                            component: {
                                name: 'Screen2',
                            }
                        });
                    }}
                    title="Manage Administators"
                />
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