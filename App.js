import React from 'react'
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './src/screens/home';
import AdminScreen from './src/screens/admin';
import EditAdminScreen from './src/screens/admin/edit-admin';
import PostListScreen from './src/screens/post-list';
import ManageInterestsScreen from './src/screens/manage-interests';
import ManageAdminsScreen from './src/screens/admin/manage-admins';
import ManageCategoriesScreen from "./src/screens/admin/manage-categories";
import EditCategoryScreen from "./src/screens/admin/categories/edit-category";
import UploadArticleScreen from "./src/screens/admin/upload-article";
import LoginScreen from './src/screens/login';
import InitScreen from './src/screens/init-app';
import TesterScreen from './src/screens/tester';
import SplashScreen from './src/screens/splash';

const MainNavigator = createStackNavigator({
        InitApp: {screen: InitScreen},
        Splash: {screen: SplashScreen},
        Tester: {screen: TesterScreen},
        Home: {
            screen: HomeScreen,
            navigationOptions: ({navigation}) => ({
                title: `Home`,
            })
        },
        Login: {screen: LoginScreen},
        PostList: {screen: PostListScreen},
        ManageInterests: {screen: ManageInterestsScreen},
        Admin: {screen: AdminScreen},
        ManageAdmins: {screen: ManageAdminsScreen},
        EditAdmin: {screen: EditAdminScreen},
        ManageCategories: {screen: ManageCategoriesScreen},
        EditCategory: {screen: EditCategoryScreen},
        UploadArticle: {screen: UploadArticleScreen},
    },
    {
        initialRouteName: 'InitApp',
    });

const App = createAppContainer(MainNavigator);
export default App;
