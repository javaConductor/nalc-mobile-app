// Admin.js
import React from 'react'
import {Button, StyleSheet, View} from 'react-native'
import {withNavigation} from "react-navigation";
import auth from '../services/auth';

//import { USER_KEY } from '../config';

class Admin extends React.Component {

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        const {navigate} = this.props.navigation;

        auth.isUserAuthenticated().then((authenticated) => {
            console.log(`componentWillMount: isAuthenticated: ${authenticated}`);
            if (!authenticated)
                navigate('Login', {target: 'Admin', targetData: {}});
        })
    }

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