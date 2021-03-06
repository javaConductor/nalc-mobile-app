import React, {Component} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import {Ionicons as Icon} from '@expo/vector-icons';

import {evaluateOuterDrawerListItems} from './utils';
import OuterDrawerItem from './outer-drawer-item';
import DrawerHeader from './drawer-header';
import auth from "../../services/auth";
import utils from '../../services/util';


const styles = StyleSheet.create({
	customDrawerTouch: {
		paddingLeft: 13,
		paddingTop: 15,
	},
	customDrawerIcon: {paddingRight: 10},
	backButtonRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingBottom: 17,
		paddingLeft: 3,
		borderBottomColor: '#F0F0F0',
		borderBottomWidth: 1,
	},
});

class MainDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			mainDrawer: true,
			currentComponent: '',
		};
	}

	async componentDidMount() {
		this.setState((prevState) => ({...prevState, isLoading: true}));
		await utils.loadFonts();
		this.setState((prevState) => ({...prevState, isLoading: false}));
	}

	toggleMainDrawer = () =>
		this.setState(prevState => ({mainDrawer: !prevState.mainDrawer}));

	renderMainDrawerComponents = mainDrawerItems => {
		const fullItemList = Object.keys(mainDrawerItems).map((item) => {
			return {itemLabel: item, ...mainDrawerItems[item]}
		});
		const nuList = fullItemList.map((item) => ({...item, hasChildren: (item.end !== item.start + 1)}));
		//console.log(`renderMainDrawerComponents: mainDrawerItems: ${JSON.stringify(nuList, null, 2)}`);
		return nuList.map(({itemLabel, start, end, hasChildren}) => (
			<OuterDrawerItem
				key={itemLabel}
				label={itemLabel}
				hasChildren={hasChildren}
				onPress={() => {
					return (end - start > 1)
						? this.setState({currentComponent: itemLabel, mainDrawer: false,})
						: this.props.navigation.navigate(itemLabel, {})
				}}
			/>
		))
	};

	navigateToCallback = routeName => {
		console.log(`MainDrawer.navigateToCallback: routeName: ${routeName}`);
		this.setState({mainDrawer: true});
		this.props.navigation.navigate(routeName);
	};

	render() {
		if (this.state.isLoading)
			return <ActivityIndicator/>;
		//navigation.state.key
		const {items, navigation, ...restProps} = this.props;
		const {mainDrawer, currentComponent} = this.state;
		const component = navigation.state.routes[navigation.state.index].key;
		//console.log(`MainDrawer.render: mainDrawer: component: ${JSON.stringify(component, utils.getCircularReplacer(), 2)} `);
		//console.log(`MainDrawer.render: mainDrawer: ${mainDrawer} currentComponent: ${currentComponent} `);
		//console.log(`MainDrawer.render: items: ${JSON.stringify(items.map(item => item), null, 2)}`);
		// get items objects with unique items and indexes
		const scopedItemsObject = evaluateOuterDrawerListItems(items);

		if (mainDrawer) {
			const obj = Object.keys(scopedItemsObject).reduce((acc, routeName) => {
				//console.log(`MainDrawer.render: routeName: ${routeName} `);
				if (routeName === component)
					return (acc);
				const obj = scopedItemsObject[routeName];
				return this.filterPublicRoutes(obj)
					? {...acc, [routeName]: obj}
					: acc;
			}, {});

			return (
				<ScrollView>
					<DrawerHeader navigateToCallback={this.navigateToCallback}/>
					{this.renderMainDrawerComponents(obj)}
				</ScrollView>
			);
		}

		const index = scopedItemsObject[currentComponent];
		const scopedItemsArr = this.filterIfNecessary(items.slice(index.start, index.end));
		//console.log(`MainDrawer.render: scopedItemsArr: ${JSON.stringify(scopedItemsArr, utils.getCircularReplacer(), 2)} `);

		return (
			<ScrollView>
				<DrawerHeader navigateToCallback={this.navigateToCallback}/>
				<TouchableOpacity
					onPress={this.toggleMainDrawer}
					style={styles.customDrawerTouch}
				>
					<View style={styles.backButtonRow}>
						<Icon
							name="ios-arrow-back"
							size={25}
							style={styles.customDrawerIcon}
							color="#666666"
						/>
						<Text style={{color: '#666666'}}>Main Menu</Text>
					</View>
				</TouchableOpacity>
				<DrawerItems
					items={scopedItemsArr}
					{...restProps}
					labelStyle={{fontSize: 16, fontFamily: "Oswald-Bold",}}/>
			</ScrollView>
		);

	}

	filterIfNecessary(scopedItemsArr) {
		//console.log(`MainDrawer.render: filterIfNecessary: scopedItemsArr: ${JSON.stringify(scopedItemsArr, utils.getCircularReplacer(), 2)} `);

		return auth.userState.canManage
			? scopedItemsArr
			: scopedItemsArr.filter((item) => !item.key.endsWith('_Administrators'));
	}

	filterPublicRoutes(route) {
		//console.log(`MainDrawer.filterPublicRoutes: route:  ${JSON.stringify(route.routeName)}`);
		if (route.routeName === 'TesterScreen') {
			const ans = true;
			//console.log(`MainDrawer.filterPublicRoutes: show: ${ans} route: ${JSON.stringify(route)}`);
			return ans;
		} else if (['InitApp', 'SplashScreen', 'Example'].includes(route.routeName)) {
			const ans = false;
			//console.log(`MainDrawer.filterPublicRoutes: show: ${ans} route: ${JSON.stringify(route)}`);
			return ans;
		} else if (route.routeName === 'Admin') {
			const ans = !auth.userState.hasAuthenticated;//showAdminMenuOptions();
			//console.log(`MainDrawer.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
			return ans;
		} else if (route.routeName === 'Administrative Tasks') {
			const ans = auth.userState.hasAuthenticated;//showAdminMenuOptions();
			//console.log(`MainDrawer.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
			return ans;
		} else if (route.routeName === 'Login') {
			const ans = false;
			//console.log(`MainDrawer.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
			return ans;
		} else if (route.routeName === 'LogOut') {
			const ans = auth.userState.hasAuthenticated;
			//console.log(`MainDrawer.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
			return ans;
		} else if (['Home', 'News', 'Manage Interests'].includes(route.routeName)) {
			const ans = true;//!auth.userState.hasAuthenticated;
			//console.log(`MainDrawer.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
			return ans;
		} else if (['Manage Categories', 'UploadArticle', 'ChangePassword', 'LogOut'].includes(route.routeName)) {
			const ans = auth.userState.hasAuthenticated;
			//console.log(`MainDrawer.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
			return ans;
		} else if (['Manage Administrators'].includes(route.routeName)) {
			const ans = auth.userState.canManage;
			//console.log(`MainDrawer.filterPublicRoutes: show: ${ans} route: ${route.routeName}`);
			return ans;
		}
		return false;
	};

}

export default MainDrawer;
