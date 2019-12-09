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
//// Login Menu Navigator
///////////////////////////////////////////////////////////////////////////////
// const authRoutes = {
// 	Login: {screen: LoginScreen, title: "Sign In"},
// 	LogOut: {screen: LogOutScreen, title: "Sign Out"}
// };
// const createLoginMenuOption = (hasAuthenticated) => {
// 	return createStackNavigator(
// 		authRoutes,
// 		{initialRouteName: hasAuthenticated ? "Login" : "LogOut"});
// };

///////////////////////////////////////////////////////////////////////////////
///// FULL Navigator with Everything !!
///////////////////////////////////////////////////////////////////////////////
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
			tabBarComponent: tabBarComponent,
		},
	);
};

const allRoutes = {
	Home: {screen: HomeScreen},
	News: {screen: PostListScreen},
	ManageInterests: {screen: ManageInterestsScreen},
	Admin: {screen: AdminScreen, title: 'Administrative Tasks'},
};

export const createMainNavigator = () => createBottomTabNavigator(
	allRoutes,
	{
		tabBarComponent: tabBarComponent,
	}
);

const filterRoutes = (route) => {
	if (route.routeName === 'Login') {
		const ans = showLoginMenuOption();
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
