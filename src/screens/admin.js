// Admin.js
import React, {Fragment} from 'react'

import {createAppContainer, NavigationEvents, withNavigation} from "react-navigation";
import auth from '../services/auth';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import EditCategoryScreen from "../screens/admin/categories/edit-category";
import ChangePasswordScreen from '../screens/admin/change-password';
import EditAdminScreen from "../screens/admin/edit-admin";
import ManageCategoriesScreen from "../screens/admin/manage-categories";
import ManageAdminsScreen from "../screens/admin/manage-admins";
import UploadArticleScreen from "../screens/admin/upload-article"
import {createStackNavigator} from "react-navigation-stack";
import util from "../services/util";
import {createAdminTabNavigator} from '../components/menu/main-nav';


class Admin extends React.Component {
	static navigationOptions = {
		title: 'Administrative Tasks',
	};

	constructor(props) {
		super(props);
		this.state = {
			canManage: false,
			initializing: true
		};
		console.log(`Admin.componentDidMount: routes: ${util.getAvailableRoutes(this.props.navigation)}`);
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
				const TopMenu = this.createMenu(canManage);
				this.setState((prevState) => {
					return {...prevState, canManage: canManage, initializing: false, TopMenu};
				});
				return this.state;
			});
	}

	createTopMenu(canManage = false) {

		///////////////////////////////////////////////////////////////////////////////
		//// M a n a g e   C a t e g o r i e s   N a v i g a t o r
		///////////////////////////////////////////////////////////////////////////////
		const categoryRoutes = {
			Categories: {screen: ManageCategoriesScreen},
			EditCategory: {screen: EditCategoryScreen},
		};
		const CategoryNavigator = createStackNavigator(
			categoryRoutes,
			{initialRouteName: "Categories"});

		///////////////////////////////////////////////////////////////////////////////
		//// M a n a g e   A d m i n s   N a v i g a t o r
		///////////////////////////////////////////////////////////////////////////////
		const manageAdminRoutes = {
			ManageAdministrators: {screen: ManageAdminsScreen},
			EditAdmin: {screen: EditAdminScreen},
		};
		const ManageAdminNavigator = createStackNavigator(
			manageAdminRoutes,
			{initialRouteName: "ManageAdministrators"});

		///////////////////////////////////////////////////////////////////////////////
		/// R O U T E S
		///////////////////////////////////////////////////////////////////////////////
		let routes = {
			'Upload Article': UploadArticleScreen,
			Categories: CategoryNavigator,
		};
		if (canManage) {
			routes = {...routes, 'Administrators': ManageAdminNavigator}
		}

		routes = {...routes, 'Change Password': ChangePasswordScreen}

		///////////////////////////////////////////////////////////////////////////////
		/// C r e a t e   A d m i n   T o p   M e n u
		///////////////////////////////////////////////////////////////////////////////
		const TopMenu = createMaterialTopTabNavigator(
			routes,
			{
				tabBarOptions: {
					activeTintColor: 'white',
					showIcon: true,
					showLabel: true,
					style: {
						backgroundColor: 'navy'
					}
				},
			});

		return createAppContainer(TopMenu);
	}

	createMenu(canManage = false) {
		return createAppContainer(createAdminTabNavigator());
	}

	render() {
		console.log(`Admin.render: canManage: ${this.state.canManage}`);
		if (this.state.initializing)
			return null;
		const {TopMenu} = this.state;
		const {navigate} = this.props.navigation;
		return (
			<Fragment>
				<NavigationEvents onDidFocus={this.componentDidMount.bind(this)}/>
				<TopMenu/>
			</Fragment>
		)
	}
}

export default withNavigation(Admin);
