// ManageInterests.js
import React from 'react'
import {Button, Switch, Text, View} from 'react-native'
import categoryService from '../services/categories';
import storage from '../services/storage';
import styles from '../screens/main-styles';


export default class ManageInterests extends React.Component {
	static navigationOptions = {
		title: 'Manage Interests',
	};

	constructor(props) {
		super(props);
		this.state = {
			isInitializing: true,
			categories: []
		};
	}

	async componentDidMount() {
		this.setState((prevState) => {
			return {...prevState, isInitializing: true}
		});

		/// get list of categories/interests
		const p = categoryService.getCategories()
			.then((categories) => {
				this.setState((prevState) => {
					return {...prevState, categories}
				});
				//console.log(`componentDidMount: Got categories: ${JSON.stringify(categories, null, 2)}`);
				return categories;
			})
			.catch((error) => {
				console.error(`Error getting list of categories: ${error}`);
				throw error;
			});
		/// create a table based on users interests : {interest: true/false}
		p.then((categories) => {
			return storage.getSelectedCategories()
				.then((userInterests) => {
					return userInterests.map(n => +n)
				})
				.then((userInterests) => {
					console.log(`componentDidMount: Got userInterests: ${JSON.stringify(userInterests, null, 2)}`);
					const obj = categories.reduce((acc, cur) => {
						const currentId = (cur.id);
						//console.log(`componentDidMount: reduce: ${JSON.stringify(userInterests, null,2)} current: ${cur.id} includes: ${(userInterests || []).includes(currentId)}`);
						return {...acc, [currentId]: (userInterests || []).includes(currentId)};
					}, {});
					console.log(`componentDidMount: Created userInterests table: ${JSON.stringify(obj, null, 2)}`);
					this.setState((prevState) => {
						return {...prevState, userInterests: obj, isInitializing: false}
					});

				})
				.catch((error) => {
					console.error(`Error make user interests map: ${error}`);
					throw error;
				});
		});
		return p;
	};

	updateUserInterest(categoryId, hasInterest) {
		const interests = {...this.state.userInterests, [+categoryId]: hasInterest};
		this.setState((prevState) => {
			return {...prevState, userInterests: interests}
		});
		console.log(`updateUserInterest: userInterests table: ${JSON.stringify(interests, null, 2)}`);

	}

	createSelectedCategoriesList(userInterests) {
		console.log(`ManageInterests.createSelectedCategoriesList: ${JSON.stringify(userInterests, null, 2)}`);
		const keys = Object.keys(userInterests);
		// console.log(`createSelectedCategoriesList: keys: ${JSON.stringify(keys, null,2)}`);
		// console.log(`createSelectedCategoriesList: selected: ${JSON.stringify(selected, null,2)}`);

		const list = keys.filter((interest) => {
			return userInterests[interest]
		}).map(n => +n);

		console.log(`ManageInterests.createSelectedCategoriesList: selected: ${JSON.stringify(list, null, 2)}`);
		return list;
	}

	async onSave() {
		console.log(`onSave()`);
		const newList = this.createSelectedCategoriesList(this.state.userInterests);
		try {
			console.log(`ManageInterests.onSave: storing table: ${JSON.stringify(newList, null, 2)}`);
			await storage.storeSelectedCategories(newList);
			this.setState((prevState) => {
				return {...prevState, message: 'Changes saved.'}
			});
		} catch (e) {
			throw e;
		}
	}

	render() {
		if (this.state.isInitializing)
			return null;

		// console.log(`render: categories: ${JSON.stringify(this.state.categories, null,2)}`);
		const rows = this.state.categories.map((cat) => {
			return this.renderRow(cat, this.state.userInterests[cat.id])
		});
		const msgCtrl = this.state.message ? <Text>{this.state.message}</Text> : null;
		return (
			<View style={styles.container}>
				{msgCtrl}
				{rows}
				<View>
					<Button
						title={'Save'}
						raised={true}
						onPress={this.onSave.bind(this)}/>
				</View>
			</View>
		)
	}

	renderRow(category, hasInterest) {

		const updateUserInterest = this.updateUserInterest.bind(this);
		return (
			<View key={category.slug} style={styles.formRow}>
				<View style={styles.formLabel}>
					<Text>{category.name}</Text>
				</View>
				<View style={styles.formInput}>
					<Switch
						onValueChange={(hasInterest) => {
							updateUserInterest(category.id, hasInterest)
						}}
						value={hasInterest}
					/>
				</View>
			</View>
		)
	}
};
