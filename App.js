import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreenOld from './src/screens/home';
import AdminScreen from './src/screens/admin';
import ManageAdminsScreen from './src/screens/admin/manage-admins';
import ManageCategoriesScreen from "./src/screens/admin/manage-categories";
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
// });
//
// export default createAppContainer(AppNavigator);

class HomeScreen extends React.Component {
    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>Home Screen</Text>
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

