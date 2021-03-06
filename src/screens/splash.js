// Splash.js
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {NavigationActions, StackActions} from "react-navigation";
import util from "../services/util";


class Splash extends React.Component {

	constructor(props) {
		super(props);
		console.log(`Splash.componentDidMount: routes: ${util.getAvailableRoutes(this.props.navigation)}`);
	}

	async componentDidMount() {
		const splashDisplayTime = 2.5;
		const {navigate} = this.props.navigation;
		setTimeout(() => {
			const resetAction = StackActions.reset({
				index: 0, // <-- currect active route from actions array
				actions: [
					NavigationActions.navigate({routeName: 'Home'}),
				],
			});

			this.props.navigation.dispatch(resetAction);
		}, splashDisplayTime * 1000)
	}

	render() {
		return <View style={styles.container}><Text>Welcome to the NALC Mobile App</Text></View>;
	}
}

export default (Splash);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});