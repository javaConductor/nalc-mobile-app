import React from 'react'
import {createStackNavigator} from "react-navigation-stack";
import {BottomTabBar, createBottomTabNavigator} from 'react-navigation-tabs';
import HomeScreen from '../../screens/home';
import LoginScreen from '../../screens/login';
import LogOutScreen from '../../screens/logOut';
import ManageInterestsScreen from '../../screens/manage-interests';
import EditCategoryScreen from "../../screens/admin/categories/edit-category";
import ChangePasswordScreen from '../../screens/admin/change-password';
import EditAdminScreen from "../../screens/admin/edit-admin";
import ManageCategoriesScreen from "../../screens/admin/manage-categories";
import ManageAdminsScreen from "../../screens/admin/manage-admins";
import UploadArticleScreen from "../../screens/admin/upload-article";
import AdminScreen from '../../screens/admin';
import News from '../../screens/news/post-list';
import PostListScreen from '../../screens/news/post-list';
import auth from '../../services/auth';
import Tester from "../../screens/tester";
///////////////////////////////////////////////////////////////////////////////
//// Manage Categories Navigator
///////////////////////////////////////////////////////////////////////////////
const categoryRoutes = {
	Categories: {screen: ManageCategoriesScreen},
	EditCategory: {screen: EditCategoryScreen},
};
const CategoryNavigator = createStackNavigator(
	categoryRoutes,
	{initialRouteName: "Categories"});

///////////////////////////////////////////////////////////////////////////////
//// Manage Admins Navigator
///////////////////////////////////////////////////////////////////////////////
const manageAdminRoutes = {
	ManageAdministrators: {screen: ManageAdminsScreen},
	EditAdmin: {screen: EditAdminScreen},
};
const ManageAdminNavigator = createStackNavigator(
	manageAdminRoutes,
	{initialRouteName: "ManageAdministrators"});

///////////////////////////////////////////////////////////////////////////////
///// A d m i n   T o p   M e n u
///////////////////////////////////////////////////////////////////////////////

const createTopMenu = (canManage = auth.userState.canManage) => {

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
};

///////////////////////////////////////////////////////////////////////////////
///// FULL Navigator with Everything !!
///////////////////////////////////////////////////////////////////////////////
const adminTabBarComponent = ({navigation, ...rest}) => {
	const filteredTabNavigatorRoutes = navigation.state.routes.filter(filterAdminRoutes);
	return (
		<BottomTabBar
			{...rest}
			navigation={{
				...navigation,
				state: {...navigation.state, routes: filteredTabNavigatorRoutes},
			}}
		/>
	);
};
const tabBarComponent = ({navigation, ...rest}) => {
	const filteredTabNavigatorRoutes = navigation.state.routes.filter(filterRoutes);
	return (
		<BottomTabBar
			{...rest}
			navigation={{
				...navigation,
				state: {...navigation.state, routes: filteredTabNavigatorRoutes},
			}}
		/>
	);
};

const adminTasksRoutes = {
	'Manage Administrators': {screen: ManageAdminNavigator},
	'Manage Categories': {screen: CategoryNavigator},
	ChangePassword: {screen: ChangePasswordScreen},
	UploadArticle: {screen: UploadArticleScreen},
	Login: {screen: LoginScreen, title: "Sign In"},
	LogOut: {screen: LogOutScreen, title: "Sign Out"},
};

const createAdminTabNavigator = () => {
	return createBottomTabNavigator(
		adminTasksRoutes,
		{
			tabBarComponent: adminTabBarComponent,
		},
	);
};

const allRoutes = {
	Home: {screen: HomeScreen},
	News: {screen: PostListScreen},
	ManageInterests: {screen: ManageInterestsScreen},
	Login: {screen: LoginScreen, title: "Sign In"},
	Admin: {screen: AdminScreen, title: 'Administrative Tasks'},
	TesterScreen: {screen: Tester}
};

export const createMainNavigator = () => createBottomTabNavigator(
	allRoutes,
	{
		tabBarComponent: tabBarComponent,
		initialRouteName: "Home"
	}
);

const filterAdminRoutes = (route) => {
	// if (route.routeName === 'LogOut') {
	// 	const ans = showLogOutMenuOption();
	// 	console.log(`MainNav.filterRoutes: show: ${ans} route: ${JSON.stringify(route)}`);
	// 	return ans;
	// } else

	if (['Manage Administrators'].includes(route.routeName)) {
		const ans = showAdminCanManage();
		console.log(`MainNav.filterRoutes: show: ${ans} route: ${JSON.stringify(route, null, 2)}`);
		return ans;
	} else if (['LogOut'].includes(route.routeName)) {
		const ans = false;
		console.log(`MainNav.filterRoutes: show: ${ans} route: ${JSON.stringify(route, null, 2)}`);
		return ans;
	}
	return true;
};

const filterRoutes = (route) => {
	if (route.routeName === 'TesterScreen') {
		const ans = true;
		console.log(`MainNav.filterRoutes: show: ${ans} route: ${JSON.stringify(route)}`);
		return ans;
	} else if (route.routeName === 'AdminMenu') {
		const ans = true;
		console.log(`MainNav.filterRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	} else if (route.routeName === 'Login') {
		const ans = false;
		console.log(`MainNav.filterRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	} else if (route.routeName === 'LogOut') {
		const ans = showLogOutMenuOption();
		console.log(`MainNav.filterRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	} else if (['Home', 'News', 'ManageInterests', "Admin"].includes(route.routeName)) {
		const ans = showDefaultOptions();
		console.log(`MainNav.filterRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	} else if (['Manage Categories', 'UploadArticle', 'ChangePassword'].includes(route.routeName)) {
		const ans = showAdminMenuOptions();
		console.log(`MainNav.filterRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	} else if (['Manage Administrators'].includes(route.routeName)) {
		const ans = showAdminCanManage();
		console.log(`MainNav.filterRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	}
	return false;
};

const showDefaultOptions = () => true;
const showLoginMenuOption = () => (!auth.userState.hasAuthenticated);
const showLogOutMenuOption = () => (auth.userState.hasAuthenticated);
const showAdminMenuOptions = () => (auth.userState.hasAuthenticated);
const showAdminCanManage = () => (auth.userState.canManage);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
