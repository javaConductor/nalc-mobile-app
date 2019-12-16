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
		console.log(`renderMainDrawerComponents: mainDrawerItems: ${JSON.stringify(nuList, null, 2)}`);
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
		const {items, ...restProps} = this.props;
		const {mainDrawer, currentComponent} = this.state;
		console.log(`MainDrawer.render: mainDrawer: ${mainDrawer} currentComponent: ${currentComponent} `);
		console.log(`MainDrawer.render: items: ${JSON.stringify(items.map(item => item), null, 2)}`);
		// get items objects with unique items and indexes
		const scopedItemsObject = evaluateOuterDrawerListItems(items);

		if (mainDrawer) {
			const obj = Object.keys(scopedItemsObject).reduce((acc, routeName) => {
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
		const scopedItemsArr = items.slice(index.start, index.end);

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

	filterPublicRoutes(route) {
		console.log(`MainDrawer.filterPublicRoutes: route:  ${JSON.stringify(route)}`);
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
		} else if (['Home', 'News', 'ManageInterests'].includes(route.routeName)) {
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