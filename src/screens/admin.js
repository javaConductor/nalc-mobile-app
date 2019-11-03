// Admin.js
import React from 'react'
import {
    View,
    Text,
    Button,
    StyleSheet,
    AsyncStorage
} from 'react-native'
import Anchor from '../components/anchor';
import {withNavigation} from "react-navigation";

//import { USER_KEY } from '../config';

class Admin extends React.Component {



    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Admin'
                },
            }
        };
    }
    // logout = async () => {
    //     try {
    //         await AsyncStorage.removeItem(USER_KEY);
    //         //goToAuth()
    //     } catch (err) {
    //         console.log('error signing out...: ', err)
    //     }
    // };
    render() {
        const {navigate} = this.props.navigation;

        return (
            <View style={styles.container}>

                <Button
                    onPress={() => {
                        navigate("ManageAdmins", {});
                    }}
                    title="Manage Administators"
                />


                <Button
                    onPress={() => {
                        navigate("ManageCategories", {});
                    }}
                    title="Manage Categories"
                />


                <Button
                    onPress={() => {
                        navigate("UploadArticle", {});
                    }}
                    title="Upload Article"
                />
            </View>
        )
    }
}
export default withNavigation(Admin);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});