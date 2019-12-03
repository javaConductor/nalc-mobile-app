// App.js
import React from 'react';
import {StyleSheet} from 'react-native';
import {createAppContainer} from "react-navigation";
import {createMainNavigator} from "./src/components/menu/main-nav";


const AppContainer = createAppContainer(createMainNavigator());

export default class App extends React.Component {
	render() {
		return <AppContainer/>;
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});