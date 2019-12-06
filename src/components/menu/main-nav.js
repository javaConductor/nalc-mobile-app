import React from 'react'
import News from '../../screens/news/post-list'; //Stack Nav
import PostListScreen from '../../screens/news/post-list';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import ManageAdminsScreen from "../../screens/admin/manage-admins";
import EditAdminScreen from "../../screens/admin/edit-admin";
import AdminScreen from '../../screens/admin';
import HomeScreen from '../../screens/home';
import ManageInterestsScreen from '../../screens/manage-interests';
import ManageCategoriesScreen from "../../screens/admin/manage-categories";
import EditCategoryScreen from "../../screens/admin/categories/edit-category";
import UploadArticleScreen from "../../screens/admin/upload-article";
import ChangePasswordScreen from '../../screens/admin/change-password';
import LoginScreen from '../../screens/login';
import LogOutScreen from '../../screens/logOut';
import {createStackNavigator} from "react-navigation-stack";
import auth from '../../services/auth';

/////////////////////////////////////////////////
//// Category Routes
/////////////////////////////////////////////////
const categoryRoutes = {
  Categories: {screen: ManageCategoriesScreen},
  EditCategory: {screen: EditCategoryScreen},
};
/////////////////////////////////////////////////
//// Category Navigator
/////////////////////////////////////////////////
const CategoryNavigator = createStackNavigator(
    categoryRoutes,
    {initialRouteName: "Categories"});

/////////////////////////////////////////////////
//// ManageAdmin Routes
/////////////////////////////////////////////////
const manageAdminRoutes = {
  ManageAdministrators: {screen: ManageAdminsScreen},
  EditAdmin: {screen: EditAdminScreen},
};
/////////////////////////////////////////////////
//// ManageAdmin Navigator
/////////////////////////////////////////////////
const ManageAdminNavigator = createStackNavigator(
    manageAdminRoutes,
    {initialRouteName: "ManageAdministrators"});

/////////////////////////////////////////////////
//// Auth Routes
/////////////////////////////////////////////////
const authRoutes = {
  Login: {screen: LoginScreen, title: "Sign In"},
  LogOut: {screen: LogOutScreen, title: "Sign Out"}
};
/////////////////////////////////////////////////
//// Auth Navigator
/////////////////////////////////////////////////
const createLoginMenuOption = (hasAuthenticated) => {
  return createStackNavigator(
      authRoutes,
      {initialRouteName: hasAuthenticated ? "Login" : "LogOut"});
};

//////////////////////
/// Routes
//////////////////////
const adminMenuRoute = {
  Admin: () => <AdminScreen/>,
  Login: {screen: createLoginMenuOption(auth.hasAuthenticated)}
};

const AdminMenuOption = createBottomTabNavigator(adminMenuRoute);

const mainRoutes = {
  Home: {screen: HomeScreen},
  News: {
    screen: PostListScreen
  },
  ManageInterests: {
    screen: ManageInterestsScreen
  },
  AdminTasks: {screen: AdminMenuOption, title: 'Administrative Tasks'},
};

const adminRoutes = {
  ChangePassword: {screen: ChangePasswordScreen},
  //EditAdmin: {screen: EditAdminScreen},
  ManageCategories: {screen: CategoryNavigator},
  UploadArticle: {screen: UploadArticleScreen},
};

const adminCanManageRoutes = {
  ...adminRoutes,
  ManageAdmins: {screen: ManageAdminNavigator},
};

//////////////////////
///// App Containers
//////////////////////
//const AdminNav = createAppContainer(createBottomTabNavigator());

export const createMainNavigator = () => createBottomTabNavigator(mainRoutes, {
  initialRouteName: "News"
});

export const createAdminTasksNavigator = (canManage = false) => {
  return createBottomTabNavigator(
      canManage ? adminCanManageRoutes : adminRoutes,
      {
        initialRouteName: "UploadArticle"
      }
  );
};