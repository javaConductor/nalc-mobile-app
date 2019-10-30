import React from 'react'
import {View, Text, Button} from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
// import HomeScreenOld from './src/screens/home';
// import AdminScreen from './src/screens/admin';
// import ManageAdminsScreen from './src/screens/admin/manage-admins';
// import ManageCategoriesScreen from "./src/screens/admin/manage-categories";
//
// const MainNavigator = createStackNavigator({
//         Home: {screen: HomeScreen},
//         Admin: {screen: AdminScreen},
//         ManageAdmins: {screen: ManageAdminsScreen},
//         ManageCategories: {screen: ManageCategoriesScreen}
//     },
//     {
//         initialRouteName: 'Home',
//     });


// const App = createAppContainer(MainNavigator);
// export default App;

// const AppNavigator = createStackNavigator({
//     Home: {
//         screen: HomeScreen,
//     },
// });echo "# nalc-mobile-app" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git remote add origin https://github.com/javaConductor/nalc-mobile-app.git
// git push -u origin master
//
// export default createAppContainer(AppNavigator);

class HomeScreen extends React.Component {
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Home Screen</Text>
                <Text>Home Screen2</Text>
                <Text>Home Screen3</Text>
            </View>
        );
    }
}

const AppNavigator = createStackNavigator({
        Home: {
            screen: HomeScreen,
        },
    },
    {
        initialRouteName: 'Home',
    }
);

export default createAppContainer(AppNavigator);

