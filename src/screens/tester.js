// Tester.js
import React from 'react'
import {Button, Linking, StyleSheet, View} from 'react-native'
import {withNavigation} from "react-navigation";
import storage from '../services/storage';


class Tester extends React.Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		const {navigate} = this.props.navigation;
		console.log(`admin.componentDidMount: state: ${JSON.stringify(this.state)}`);

		this.setState((prevState) => {
			return {...prevState, initializing: true};
		});

		// return auth.isUserAuthenticated()
		// 	.then((authenticated) => {
		// 		console.log(`admin.componentDidMount: isAuthenticated: ${authenticated}`);
		// 		if (!authenticated) {
		// 			console.log(`componentDidMount: navigating to Login screen.`);
		// 			navigate('Login', {target: 'Admin', targetData: {}});
		// 			return false;
		// 		} else {
		// 			return auth.currentUserCanManageAdmins();
		// 		}
		// 	})
		// 	.then((canManage) => {
		// 		console.log(`admin.componentDidMount: canManage: ${canManage}`);
		// 		this.setState((prevState) => {
		// 			return {...prevState, canManage: canManage, initializing: false};
		// 		});
		// 		return this.state;
		// 	});
	}

	async removeSetupFlag() {
		await storage.storeSetupFlag(false);
	}

	async invalidateToken() {
		const authInfo = await storage.getAuthInfo();
		authInfo.accessTokenExpires = new Date(-7).valueOf();
		return storage.storeAuthInfo(authInfo);

	}

	render() {
		const {navigate} = this.props.navigation;
		return (

			<View style={styles.container}>
				{/*<NavigationEvents onDidFocus={this.componentDidMount.bind(this)} />*/}
				<Button
					onPress={this.removeSetupFlag.bind(this)}
					title="Remove Setup Flag"
				/>
				<Button
					onPress={() => navigate('Example', {})}
					title="Nav Example"
				/>
				<Button
					onPress={() => navigate('FacebookView', {})}
					title="facebook"
				/>
				<Button
					onPress={() => Linking.openURL('http://facebook.com/LeeCollinsChicago')}
					title="facebook link"
				/>
			</View>
		)
	}
}

export default withNavigation(Tester);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
});