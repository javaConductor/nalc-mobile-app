import React from 'react'
import {View, Text, Button} from 'react-native';

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

const MainNavigator = createStackNavigator({
        Home: {screen: HomeScreen},
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
        initialRouteName: 'Home',
    });

const App = createAppContainer(MainNavigator);
export default App;

