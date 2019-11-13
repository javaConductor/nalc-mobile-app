// InitApp.js
import React from 'react'
import {ActivityIndicator, StyleSheet} from 'react-native'
import initApp from '../services/initApp';

class InitApp extends React.Component {

    async componentDidMount() {
        const {navigate} = this.props.navigation;

        this.setState((prevState) => {
            return {...prevState, isLoading: true}
        });
        await initApp.initApp()
            .then((firstTimeRun) => {
                console.log(`InitApp.componentDidMount: firstTimeRun: ${firstTimeRun}`);
                if (firstTimeRun)
                    navigate('Splash', {});
                else
                    navigate('Home', {});
                console.log(`InitApp.componentDidMount: navigated away`);
                this.setState((prevState) => {
                    return {...prevState, isLoading: false}
                })
            });

    }

    render() {
        return <ActivityIndicator size="large" color="#0000ff"/>;
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