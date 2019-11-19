// Admin.js
import React from 'react'
import {Button, StyleSheet, View} from 'react-native'
import {NavigationEvents, withNavigation} from "react-navigation";
import auth from '../services/auth';

class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {canManage: false};
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

    async componentDidMount() {
        const {navigate} = this.props.navigation;
        console.log(`admin.componentDidMount: state: ${JSON.stringify(this.state)}`);

        this.setState((prevState) => {
            return {...prevState, initializing: true};
        });

        return auth.isUserAuthenticated()
            .then((authenticated) => {
                console.log(`admin.componentDidMount: isAuthenticated: ${authenticated}`);
                if (!authenticated) {
                    console.log(`componentDidMount: navigating to Login screen.`);
                    navigate('Login', {target: 'Admin', targetData: {}});
                    return false;
                } else {
                    return auth.currentUserCanManageAdmins();
                }
            })
            .then((canManage) => {
                console.log(`admin.componentDidMount: canManage: ${canManage}`);
                this.setState((prevState) => {
                    return {...prevState, canManage: canManage, initializing: false};
                });
                return this.state;
            });
    }

    render() {
        const {navigate} = this.props.navigation;
        if (this.state.initializing)
            return null;
        console.log(`admin.render: canManage: ${this.state.canManage}`);
        const manageButton = this.state.canManage ? <Button
            //const manageButton = (true) ? <Button
            onPress={() => {
                navigate("ManageAdmins", {});
            }}
            title="Manage Administators"
        /> : null;

        return (

            <View style={styles.container}>
                <NavigationEvents onDidFocus={this.componentDidMount.bind(this)}/>

                {manageButton}
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
                <Button
                    onPress={() => {
                        navigate("ChangePassword", {});
                    }}
                    title="Change Password"
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