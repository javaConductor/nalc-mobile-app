// ManageCategories.js
import React from 'react'
import {Button, StyleSheet, Text, View} from 'react-native'
import categoryService from '../../services/categories';
import {NavigationEvents} from "react-navigation";


export default class ManageCategories extends React.Component {
	static navigationOptions = {
		title: 'Manage Categories',
	};

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true
		}
	}

	async componentDidMount() {
		this.setState((prevState) => {
			return {...prevState, isLoading: true}
		});
		const {navigate} = this.props.navigation;
		try {
			const categories = await categoryService.getCategories();
			console.log(`ManageCategories.componentDidMount: categories: (${JSON.stringify(categories)})`);

			this.setState((prevState) => {
				return {...prevState, isLoading: false, categories}
			});
		} catch (e) {
			if (typeof e === 'object' && (e.authenticationRequired || e.badToken)) {
				navigate("Login", {target: "ManageCategories"});
			}
		}
	}

	render() {
		if (this.state.isLoading)
			return null;
		const {navigate} = this.props.navigation;
		console.log(`ManageCategories.render: categories: (${JSON.stringify(this.state.categories)})`);

		return (
			<View style={styles.container}>
				<NavigationEvents onWillFocus={this.componentDidMount.bind(this)}/>
				<Text>Manage Categories</Text>
				<Button onPress={() => navigate('EditCategory', {})} title={"Add New Category"}/>
				{this.state.categories.map(this.renderRow.bind(this))}
			</View>
		)
	}

	onRemove(categoryId) {

	}

	renderRow(category) {
		const {navigate} = this.props.navigation;

		return (
			<View style={styles.row} key={category.id}>
				<Button title={category.name} onPress={() => navigate('EditCategory', {category})}/>
				<Button title={category.slug} onPress={() => navigate('EditCategory', {category})}/>

			</View>
		)

	}

	addNewCategory() {

	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
});