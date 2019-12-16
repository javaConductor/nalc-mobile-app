// App.js
import React from 'react';
import HomeScreen from "./src/screens/home";
import PostListScreen from "./src/screens/news/post-list";
import ManageInterestsScreen from "./src/screens/manage-interests";
import LoginScreen from "./src/screens/login";
import AdminScreen from "./src/screens/admin";
import Tester from "./src/screens/tester";
import Example from "./src/screens/example";
import InitApp from "./src/screens/init-app";
import Splash from "./src/screens/splash";
import DrawerNavigator from "./src/components/menu/drawer-nav";


const publicRoutes = {
	Home: {screen: HomeScreen},
	News: {screen: PostListScreen},
	ManageInterests: {screen: ManageInterestsScreen, title: "Interests"},
	Login: {screen: LoginScreen, title: "Sign In"},
	Admin: {screen: AdminScreen, title: 'Administrative Tasks'},
	TesterScreen: {screen: Tester},
	Example: Example,
	InitApp: InitApp,
	SplashScreen: {screen: Splash, title: 'Initializing NALC Mobile . . .'},
};

//const AppContainer = createAppContainer(createMainNavigator());

const App = () => (
	<DrawerNavigator/>
);

export default App;
