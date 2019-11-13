// InitApp.js
import React from 'react'
import {ActivityIndicator, StyleSheet} from 'react-native'
import initApp from '../services/initApp';
import View from "react-native-web/dist/exports/View";
import {NavigationActions, NavigationEvents, StackActions} from "react-navigation";

class InitApp extends React.Component {
    static navigationOptions = {
        title: 'Initializing App ...',
    };
    constructor(props) {
        super(props);
        this.state = {isLoading: true}
    }

    async componentDidMount() {
        const {navigate} = this.props.navigation;
        this.setState((prevState) => {
            return {...prevState, isLoading: true}
        });
        const firstTimeRun = await initApp.initApp();
        console.log(`InitAppScreen.componentDidMount: firstTimeRun: ${firstTimeRun}`);
        if (firstTimeRun) {
            //navigate('Splash', {});
            const resetAction = StackActions.reset({
                index: 0, // <-- currect active route from actions array
                actions: [
                    NavigationActions.navigate({ routeName: 'Splash' }),
                ],
            });
            this.props.navigation.dispatch(resetAction);
        }
        else {
            //navigate('Home', {});

            const resetAction = StackActions.reset({
                index: 0, // <-- currect active route from actions array
                actions: [
                    NavigationActions.navigate({ routeName: 'Home' }),
                ],
            });

            this.props.navigation.dispatch(resetAction);
        }
        console.log(`InitAppScreen.componentDidMount: navigated away`);
        // this.setState((prevState) => {
        //     return {...prevState, isLoading: false}
        // })
    }

    render() {
        const {navigate} = this.props.navigation;
        if (this.state.isLoading)
            return <View>
                <NavigationEvents onDidFocus={this.componentDidMount.bind(this)} />
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>;
       return null;
    }
}

export default InitApp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});