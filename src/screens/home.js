// Home.js
import React from 'react';
import {View, Text, Button} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

class HomeScreen extends React.Component {
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>NALC Mobile in view</Text>
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

