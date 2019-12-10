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
import InitApp from "../../screens/init-app";
import Splash from "../../screens/splash";
import Example from "../../screens/example";

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
	UploadArticle: {screen: UploadArticleScreen, title: "U p l o a d   A r t i c l e"},
	'Manage Administrators': {screen: ManageAdminNavigator},
	'Manage Categories': {screen: CategoryNavigator},
	ChangePassword: {screen: ChangePasswordScreen},
	Login: {screen: LoginScreen, title: "Sign In"},
	LogOut: {screen: LogOutScreen, title: "Sign Out"},
};

const filterAdminRoutes = (route) => {
	if (['Manage Administrators'].includes(route.routeName)) {
		const ans = showAdminCanManage();
		//console.log(`MainNav.filterAdminRoutes: show: ${ans} route: ${JSON.stringify(route, null, 2)}`);
		return ans;
	} else if (['LogOut'].includes(route.routeName)) {
		const ans = false;
		//.log(`MainNav.filterAdminRoutes: show: ${ans} route: ${JSON.stringify(route, null, 2)}`);
		return ans;
	} else if (['Login'].includes(route.routeName)) {
		const ans = false;
		//.log(`MainNav.filterAdminRoutes: show: ${ans} route: ${JSON.stringify(route, null, 2)}`);
		return ans;
	}
	return true;
};

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

export const createAdminTabNavigator = () => {
	return createBottomTabNavigator(
		adminTasksRoutes,
		{
			tabBarComponent: adminTabBarComponent,
			initialRouteName: "Manage Categories"
		},
	);
};

///////////////////////////////////////////////////////////////////////////////
///// P u b l i c   N a v i g a t o r
///////////////////////////////////////////////////////////////////////////////
const publicRoutes = {
	Home: {screen: HomeScreen},
	News: {screen: PostListScreen},
	ManageInterests: {screen: ManageInterestsScreen},
	Login: {screen: LoginScreen, title: "Sign In"},
	Admin: {screen: AdminScreen, title: 'Administrative Tasks'},
	TesterScreen: {screen: Tester},
	Example: Example,
	InitApp: InitApp,
	SplashScreen: {screen: Splash, title: 'Initializing NALC Mobile . . .'},
};

const filterPublicRoutes = (route) => {
	//console.log(`MainNav.filterRoutes: route: ${JSON.stringify(route)}`);
	if (route.routeName === 'TesterScreen') {
		const ans = true;
		//console.log(`MainNav.filterPublicRoutes: show: ${ans} route: ${JSON.stringify(route)}`);
		return ans;
	} else if (['InitApp', 'SplashScreen', 'Example'].includes(route.routeName)) {
		const ans = false;
		//console.log(`MainNav.filterPublicRoutes: show: ${ans} route: ${JSON.stringify(route)}`);
		return ans;
	} else if (route.routeName === 'AdminMenu') {
		const ans = true;
		//console.log(`MainNav.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	} else if (route.routeName === 'Login') {
		const ans = false;
		//console.log(`MainNav.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	} else if (route.routeName === 'LogOut') {
		const ans = showLogOutMenuOption();
		//console.log(`MainNav.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	} else if (['Home', 'News', 'ManageInterests', "Admin"].includes(route.routeName)) {
		const ans = showDefaultOptions();
		//console.log(`MainNav.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	} else if (['Manage Categories', 'UploadArticle', 'ChangePassword'].includes(route.routeName)) {
		const ans = showAdminMenuOptions();
		//console.log(`MainNav.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	} else if (['Manage Administrators'].includes(route.routeName)) {
		const ans = showAdminCanManage();
		//console.log(`MainNav.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
		return ans;
	}
	return false;
};

const publicTabBarComponent = ({navigation, ...rest}) => {
	const filteredTabNavigatorRoutes = navigation.state.routes.filter(filterPublicRoutes);
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

export const createMainNavigator = () => createBottomTabNavigator(
	publicRoutes,
	{
		tabBarComponent: publicTabBarComponent,
		initialRouteName: "InitApp"
	}
);
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const showDefaultOptions = () => true;
const showLogOutMenuOption = () => (auth.userState.hasAuthenticated);
const showAdminMenuOptions = () => (auth.userState.hasAuthenticated);
const showAdminCanManage = () => (auth.userState.canManage);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
