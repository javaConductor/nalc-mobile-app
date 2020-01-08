// LogOut.js
import React from 'react'
import {View} from 'react-native'
import auth from '../services/auth';
import styles from './main-styles';
import {withNavigation} from "react-navigation";


class LogOut extends React.Component {
	static navigationOptions = {
		title: 'Sign Out',
		headerLeft: null
	};

	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		const {navigate} = this.props.navigation;
		await auth.logoff();
		return navigate("Home", {});
	}

	render() {
		return (
			<View style={styles.container}>

			</View>
		)
	}
}

export default withNavigation(LogOut);
