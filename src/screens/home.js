// Home.js
import React from 'react';
import {View, Text, Button} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import systemCheck from "../services/system-check";

class HomeScreen extends React.Component {
    async componentDidMount() {
        try {
            console.log("Home.componentDidMount");
            await systemCheck.check();
            console.log("Home.componentDidMount: check OK");
        } catch (e) {
            console.log("Home.componentDidMount: check FAILED!!!");
            throw e;
        }
    }

    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>N A L C   M o b i l e</Text>
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

