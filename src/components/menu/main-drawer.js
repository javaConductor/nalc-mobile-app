import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';
import {Ionicons as Icon} from '@expo/vector-icons';

import {evaluateOuterDrawerListItems} from './utils';
import OuterDrawerItem from './outer-drawer-item';
import DrawerHeader from './drawer-header';


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
			mainDrawer: true,
			currentComponent: '',
		};
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
		const {items, ...restProps} = this.props;
		const {mainDrawer, currentComponent} = this.state;
		console.log(`MainDrawer.render: mainDrawer: ${mainDrawer} currentComponent: ${currentComponent} `);
		console.log(`MainDrawer.render: items: ${JSON.stringify(items.map(item => item), null, 2)}`);
		// get items objects with unique items and indexes
		const scopedItemsObject = evaluateOuterDrawerListItems(items);

		if (mainDrawer) {
			return (
				<ScrollView>
					<DrawerHeader navigateToCallback={this.navigateToCallback}/>
					{this.renderMainDrawerComponents(scopedItemsObject)}
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
				<DrawerItems items={scopedItemsArr} {...restProps} />
			</ScrollView>
		);
	}
}

export default MainDrawer;