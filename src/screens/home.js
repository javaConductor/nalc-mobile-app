// Home.js
import React from 'react';
import {Dimensions, Image, View} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import systemCheck from "../services/system-check";
import auth from '../services/auth';
import Menu from '../components/menu';
import Styles from '../screens/main-styles';


const logo = require('../../assets/gldLogo72.png');

class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Home',
		headerLeft: null
	};

	constructor(props) {
		super(props);
		this.state = {
			menuOpen: false,
			isAuthentiated: false,
			dims: Dimensions.get('screen')
		};
		this._isMounted = false;

	}

	async componentDidMount() {
		this._isMounted = true;
		try {

			console.log("Home.componentDidMount");
			console.log(`Home.componentDidMount: dim.screen ${JSON.stringify(Dimensions.get('screen'), null, 2)}  dim.window ${JSON.stringify(Dimensions.get('window'))}`);
			await systemCheck.check();
			console.log("Home.componentDidMount: check OK");
			const isAuthenticated = await auth.isUserAuthenticated();
			console.log(`Home.componentDidMount: setting isAuthenticated: ${isAuthenticated}`);
			if (this._isMounted)
				this.setState((prevState) => {
					return {...prevState, isAuthenticated, dims: Dimensions.get('screen')}
				});

		} catch (e) {
			console.log("Home.componentDidMount: check FAILED!!!");
			throw e;
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	onLogOff() {
		auth.logoff();
		this.setState((prevState) => {
			return {...prevState, isAuthenticated: false}
		})
	}

	render() {
		console.log(`Home.render: userIsAuthenticated: ${this.state.isAuthenticated}`);
		return (
			<View style={{flexDirection: 'row', zIndex: 0, alignItems: "stretch"}}>
				<View style={{...Styles.formRow, zIndex: 2}}>
					<Menu/>
				</View>
				<View style={{...Styles.logoContainer}}>
					<Image
						style={Styles.logo}
						source={logo}
						resizeMode={'contain'}
					/>
				</View>

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

