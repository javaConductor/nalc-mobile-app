// Admin.js
import React from 'react'
import {View} from 'react-native'
import {createAppContainer, NavigationEvents, withNavigation} from "react-navigation";
import auth from '../services/auth';
import {createAdminTasksNavigator} from "../components/menu/main-nav";
import Styles from '../screens/main-styles';


class Admin extends React.Component {
	static navigationOptions = {
		title: 'Administrative Tasks',
	};

	constructor(props) {
		super(props);
		this.state = {canManage: false, initializing: true};
	}

	async componentDidMount() {
		const {navigate} = this.props.navigation;
		console.log(`Admin.componentDidMount: state: ${JSON.stringify(this.state)}`);

		this.setState((prevState) => {
			return {...prevState, initializing: true};
		});

		return auth.isUserAuthenticated()
			.then((authenticated) => {
				console.log(`Admin.componentDidMount: isAuthenticated: ${authenticated}`);
				if (!authenticated) {
					console.log(`Admin.componentDidMount: navigating to Login screen.`);
					navigate('Login', {target: 'Admin', targetData: {}});
					return false;
				} else {
					return auth.currentUserCanManageAdmins();
				}
			})
			.then((canManage) => {
				console.log(`Admin.componentDidMount: canManage: ${canManage}`);
				const AdminTasks = createAppContainer(createAdminTasksNavigator(canManage));

				this.setState((prevState) => {
					return {...prevState, canManage: canManage, initializing: false, AdminTasks};
				});
				return this.state;
			});
	}

	render() {
		console.log(`Admin.render: canManage: ${this.state.canManage}  `);

		if (this.state.initializing)
			return null;
		const {navigate} = this.props.navigation;
		const AdminTasks = this.state.AdminTasks;

		return (
			<View style={Styles.container}>
				<NavigationEvents onDidFocus={this.componentDidMount.bind(this)}/>
				<AdminTasks/>
				{/*<Text> A D M I N </Text>*/}
			</View>
		)
	}
}

export default withNavigation(Admin);
