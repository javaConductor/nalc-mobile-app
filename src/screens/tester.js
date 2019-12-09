// Tester.js
import React from 'react'
import {Button, Linking, StyleSheet, View} from 'react-native'
import {withNavigation} from "react-navigation";
import storage from '../services/storage';
import auth from '../services/auth';


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
					onPress={() => {
						auth.logoff().then(() => navigate('Home', {}))
					}}
					title="Log Out"
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