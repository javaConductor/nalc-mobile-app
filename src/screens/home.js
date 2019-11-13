// Home.js
import React from 'react';
import {View, Text, Button} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import systemCheck from "../services/system-check";
import auth from '../services/auth';

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthentiated : false
        }
    }

    async componentDidMount() {
        try {
            console.log("Home.componentDidMount");
            await systemCheck.check();
            console.log("Home.componentDidMount: check OK");
            const isAuthenticated = await auth.isUserAuthenticated();
            console.log(`Home.componentDidMount: setting isAuthenticated: ${isAuthenticated }`);
            this.setState((prevState ) => { return {...prevState, isAuthenticated } });
        } catch (e) {
            console.log("Home.componentDidMount: check FAILED!!!");
            throw e;
        }
    }
    onLogOff(){
        auth.logoff();
        this.setState((prevState ) => { return {...prevState, isAuthenticated:false} })
    }

    render() {
        const {navigate} = this.props.navigation;
        console.log(`Home.render: userIsAuthenticated: ${this.state.isAuthenticated}`);

        const logoffComponent = this.state.isAuthenticated
            ? <Button title={'Sign Out'} onPress={this.onLogOff.bind(this) }/>
            : null;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>N A L C   M o b i l e</Text>
                {logoffComponent}
                <Button
                    onPress={() => {
                        navigate("Admin", {});
                    }}
                    title="Admin"
                />
                <Button
                    onPress={() => {
                        navigate("ManageInterests", {});
                    }}
                    title="Manage Interests"
                />
                <Button
                    onPress={() => {
                        navigate("PostList", {});
                    }}
                    title="News"
                />
                <Button
                    onPress={() => {
                        navigate("Tester", {});
                    }}
                    title="Tester"
                />

            </View>
        );
    }
}

const AppNavigator = createStackNavigator({
    Home: {
        screen: HomeScreen,
    },
});

export default createAppContainer(AppNavigator);

