import React from "react";
import {ActivityIndicator, Dimensions, SafeAreaView, ScrollView, Text, View} from 'react-native';
import HomeScreen from '../../screens/home';
import NewsScreen from '../../screens/news/post-list';
import ManageInterestsScreen from "../../screens/manage-interests";
import LoginScreen from "../../screens/login";
import AdminScreen from "../../screens/admin";
import Tester from "../../screens/tester";
import Example from "../../screens/example";
import InitApp from "../../screens/init-app";
import Splash from "../../screens/splash";
import {createDrawerNavigator, DrawerItems} from "react-navigation-drawer";
import {createAppContainer, NavigationEvents} from "react-navigation";
import auth from "../../services/auth";
import UploadArticleScreen from "../../screens/admin/upload-article";
import ChangePasswordScreen from "../../screens/admin/change-password";
import LogOutScreen from "../../screens/logOut";
import ManageCategoriesScreen from "../../screens/admin/manage-categories";
import EditCategoryScreen from "../../screens/admin/categories/edit-category";
import {createStackNavigator} from "react-navigation-stack";
import ManageAdminsScreen from "../../screens/admin/manage-admins";
import EditAdminScreen from "../../screens/admin/edit-admin";
import MainDrawer from "./main-drawer";
import {evaluateChildDrawerTitle} from './utils';
import utils from '../../services/util';


const WIDTH = Dimensions.get('window').width;

const createDrawerNavComponent = (routeFilterFn) => {
	return class Drawer extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				isLoading: true
			}
		}

		async componentDidMount() {
			this.setState((prevState) => ({...prevState, isLoading: true}));
			await utils.loadFonts();
			this.setState((prevState) => ({...prevState, isLoading: false}));
		}

		render() {
			if (this.state.isLoading)
				return <ActivityIndicator/>;
			//console.log(`Drawer.render: props ${JSON.stringify(Object.keys(this.props))}`);
			//console.log(`Drawer.render: props.descriptors ${JSON.stringify( this.props.descriptors, null, 2 ) }`);
			return (
				<View>
					<NavigationEvents
						onWillFocus={this.componentDidMount.bind(this)}
						onDidFocus={this.componentDidMount.bind(this)}
					/>
					<Text>NALC Menu Header</Text>
					<ScrollView>
						<SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
							{this.drawerItems()}
						</SafeAreaView>
					</ScrollView>
					<Text>NALC Menu Footer</Text>
				</View>
			)
		}

		drawerItems() {
			const {items} = this.props;
			const filteredItems = items.filter(routeFilterFn);
			//console.log(`Drawer.drawerItems: filteredItems ${JSON.stringify(filteredItems, null, 2)}`);
			const newProps = {...this.props, items: filteredItems};
			return (
				<DrawerItems  {...newProps} labelStyle={{fontSize: 16, fontFamily: "Oswald-Bold"}}/>
			);
		}
	}
};

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
///// A d m i n   N a v i g a t o r
///////////////////////////////////////////////////////////////////////////////
const adminTasksRoutes = {
	UploadArticle: {screen: UploadArticleScreen, header: null, title: "U p l o a d   A r t i c l e"},
	'Manage Administrators': {screen: ManageAdminNavigator, title: "Administrators"},
	'Manage Categories': {screen: CategoryNavigator, title: "Categories"},
	ChangePassword: {screen: ChangePasswordScreen, title: "Change Password"},
	Login: {screen: LoginScreen, title: "Sign In"},
	LogOut: {screen: LogOutScreen, title: "Sign Out"},
};

const filterAdminRoutes = (route) => {
	console.log(`DrawerNavigator.filterAdminRoutes: route: ${JSON.stringify(route, null, 2)}`);
	if (['Manage Administrators'].includes(route.routeName)) {
		const ans = showAdminCanManage();
		//console.log(`DrawerNavigator.filterAdminRoutes: show: ${ans} route: ${JSON.stringify(route, null, 2)}`);
		return ans;
	} else if (['LogOut'].includes(route.routeName)) {
		const ans = false;
		//.log(`DrawerNavigator.filterAdminRoutes: show: ${ans} route: ${JSON.stringify(route, null, 2)}`);
		return ans;
	} else if (['Login'].includes(route.routeName)) {
		const ans = false;
		//.log(`DrawerNavigator.filterAdminRoutes: show: ${ans} route: ${JSON.stringify(route, null, 2)}`);
		return ans;
	}
	return true;
};

/// Admin Navigator
const createAdminDrawerNavigator = () => {
	return createDrawerNavigator(
		adminTasksRoutes,
		{
			contentComponent: createDrawerNavComponent(filterAdminRoutes),
		},
	);
};

const AdminDrawerConfig = {
	drawerWidth: WIDTH * 0.53,
	drawerPosition: 'right',
	contentComponent: createDrawerNavComponent(filterAdminRoutes),
};

const adminNavigator = createAppContainer(createAdminDrawerNavigator());

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// const DrawerConfig = {
// 	drawerWidth: WIDTH * 0.83,
// 	drawerPosition: 'right',
// 	contentComponent: createDrawerNavComponent(filterPublicRoutes),
// };
//
// const DrawerNavigator = createDrawerNavigator(publicRoutes, DrawerConfig);
const DrawerConfig = {
	drawerWidth: WIDTH * 0.83,
	drawerPosition: 'right',
	contentComponent: MainDrawer,
	initialRouteName: "InitApp"
};

///////////////////////////////////////////////////////////////////////////////
///// A l l   N a v i g a t o r s
///////////////////////////////////////////////////////////////////////////////
const allTasksRoutes = {
	Home: {screen: HomeScreen},
	News: {screen: NewsScreen},
	'Manage Interests': {screen: ManageInterestsScreen, title: "Interests",},
	Login: {screen: LoginScreen, title: "Sign In"},
	Admin: {screen: AdminScreen, title: 'Administrative Tasks'},
	AdminMenu: {screen: adminNavigator, title: 'Administrative Tasks'},
	'Administrative Tasks_Publish Article': {
		screen: UploadArticleScreen,
		header: null,
		navigationOptions: evaluateChildDrawerTitle,
		title: "P u b l i s h  A r t i c l e"
	},
	'Administrative Tasks_Administrators': {
		screen: ManageAdminNavigator,
		title: "Administrators",
		navigationOptions: evaluateChildDrawerTitle,
	},
	'Administrative Tasks_Manage Categories': {
		screen: CategoryNavigator,
		title: "Categories",
		navigationOptions: evaluateChildDrawerTitle,
	},
	'Administrative Tasks_Change Password': {
		screen: ChangePasswordScreen,
		title: "Change Password",
		navigationOptions: evaluateChildDrawerTitle,
	},
	TesterScreen: {screen: Tester, navigationOptions: evaluateChildDrawerTitle},

	'LogOut': {
		screen: LogOutScreen,
		title: "Sign Out",
		navigationOptions: evaluateChildDrawerTitle,
	},

	'Dev_TesterScreen': {screen: Tester, navigationOptions: evaluateChildDrawerTitle},
	'Dev_Example': {screen: Example, navigationOptions: evaluateChildDrawerTitle},
	InitApp: InitApp,
	SplashScreen: {screen: Splash, title: 'Initializing NALC Mobile . . .'},
};

const DrawerNavigator = createDrawerNavigator(allTasksRoutes, DrawerConfig);

const showDefaultOptions = () => true;
const showLogOutMenuOption = () => (auth.userState.hasAuthenticated);
const showAdminMenuOptions = () => (auth.userState.hasAuthenticated);
const showAdminCanManage = () => (auth.userState.canManage);

export default createAppContainer(DrawerNavigator);
