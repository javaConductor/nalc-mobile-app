// InitApp.js
import React from 'react'
import {ActivityIndicator, View} from 'react-native'
import initApp from '../services/initApp';
import {NavigationActions, NavigationEvents, StackActions, withNavigation} from "react-navigation";
import util from "../services/util";


class InitApp extends React.Component {
	static navigationOptions = {
		title: 'Initializing App ...',
	};

	constructor(props) {
		super(props);
		this.state = {isLoading: true};
		console.log(`InitApp.componentDidMount: routes: ${util.getAvailableRoutes(this.props.navigation)}`);
	}

	async componentDidMount() {
		const {navigate} = this.props.navigation;
		this.setState((prevState) => {
			return {...prevState, isLoading: true}
		});
		const firstTimeRun = await initApp.initApp();
		console.log(`InitApp.componentDidMount: firstTimeRun: ${firstTimeRun}`);
		if (firstTimeRun) {
			console.log(`InitApp.componentDidMount: navigated to SplashScreen`);
			navigate('SplashScreen', {});
			// const resetAction = StackActions.reset({
			// 	index: 0, // <-- currect active route from actions array
			// 	actions: [
			// 		NavigationActions.navigate({routeName: 'SplashScreen'}),
			// 	],
			// });
			// this.props.navigation.dispatch(resetAction);
		} else {
			//navigate('Home', {});
			console.log(`InitApp.componentDidMount: navigated to Home`);
			const resetAction = StackActions.reset({
				index: 0, // <-- currect active route from actions array
				actions: [
					NavigationActions.navigate({routeName: 'Home'}),
				],
			});

			this.props.navigation.dispatch(resetAction);
		}
		// this.setState((prevState) => {
		//     return {...prevState, isLoading: false}
		// })
	}

	render() {
		console.log(`InitApp.render: isLoading: ${this.state.isLoading}`);
		if (this.state.isLoading)
			return <View>
				<NavigationEvents onDidFocus={this.componentDidMount.bind(this)}/>
				<ActivityIndicator size="large" color="#0000ff"/>
			</View>;
		return null;
	}
}

export default withNavigation(InitApp);

