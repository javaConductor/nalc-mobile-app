// InitApp.js
import React from 'react'
import {ActivityIndicator, StyleSheet} from 'react-native'
import initApp from '../services/initApp';

class InitApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isLoading: true}
    }

    async componentDidMount() {
        const {navigate} = this.props.navigation;
        const firstTimeRun = await initApp.initApp();
        console.log(`InitAppScreen.componentDidMount: firstTimeRun: ${firstTimeRun}`);
        if (firstTimeRun)
            navigate('Splash', {});
        else
            navigate('Home', {});
        console.log(`InitAppScreen.componentDidMount: navigated away`);
        this.setState((prevState) => {
            return {...prevState, isLoading: false}
        })
    }

    render() {
        const {navigate} = this.props.navigation;
        if (this.state.isLoading)
            return <ActivityIndicator size="large" color="#0000ff"/>;
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