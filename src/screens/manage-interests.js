// ManageInterests.js
import React from 'react'
import {Button, ScrollView, StyleSheet, Switch, Text, View} from 'react-native'
import categoryService from '../services/categories';
import storage from '../services/storage';
import styles from '../screens/main-styles';
import util from "../services/util";
import {Col, Grid, Row} from "react-native-easy-grid";
import MenuButton from "../components/menu/menu-button";
import {XmlEntities as Entities} from 'html-entities';
import {NavigationEvents} from "react-navigation";
import Styles from "./main-styles";


const entities = new Entities();

const localStyles = StyleSheet.create({

	rowContainer: {
		borderTopWidth: 2,
		backgroundColor: '#e0eaf6'
	},
	button: {
		backgroundColor: '#003459',
		marginRight: 10,
		marginLeft: 10,
		marginTop: 10,
		// paddingRight: 50,
		paddingTop: 10,
		paddingBottom: 10,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#fff'
	},
	buttonText: {
		color: '#e0eaf6',
		textAlign: 'center',
		paddingLeft: 10,
		paddingRight: 10
	},

});

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

		/// get list of categoryService/interests
		const p = categoryService.getCategories()
			.then((categories) => {
				this.setState((prevState) => {
					return {...prevState, categories}
				});
				//console.log(`componentDidMount: Got categoryService: ${JSON.stringify(categoryService, null, 2)}`);
				return categories;
			})
			.catch((error) => {
				console.error(`Error getting list of categories: ERROR: ${util.errorMessage(error)}`);
				throw error;
			});
		/// create a table based on users interests: {interest: true/false}
		p.then((categories) => {
			return storage.getSelectedCategories()
				.then((userInterests) => {
					return userInterests.map(n => +n) /// make sure they are numbers
				})
				.then((userInterests) => {
					console.log(`componentDidMount: Got userInterests: ${JSON.stringify(userInterests, null, 2)}`);
					const obj = categories.reduce((acc, cur) => {
						return {...acc, [cur.id]: (userInterests || []).includes(cur.id)};
					}, {});
					//console.log(`componentDidMount: Created userInterests table: ${JSON.stringify(obj, null, 2)}`);
					this.setState((prevState) => {
						return {...prevState, userInterests: obj, isInitializing: false}
					});

				})
				.catch((error) => {
					console.error(`Error make user interests map: ${util.errorMessage(error)}`);
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

	onBlur() {
		this.setState((prevState) => {
			return {...prevState, message: null}
		});
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
			console.error(`ManageInterests.onSave: ERROR: ${util.errorMessage(e)}`);
			throw e;
		}
	}

	/**
	 *
	 * @returns {null|<ScrollView>}
	 */
	render() {
		if (this.state.isInitializing)
			return null;

		/// create a row for each category
		const rows = this.state.categories.map((cat) => {
			return this.renderRow(cat, this.state.userInterests[cat.id])
		});
		const msgCtrl = this.state.message ? <Text style={styles.message}>{this.state.message}</Text> : null;
		const errCtrl = this.state.errorMessage ? <Text style={styles.error}>{this.state.errorMessage}</Text> : null;
		return (
			<View style={styles.container}>

				<NavigationEvents
					onDidBlur={this.onBlur.bind(this)}
				/>

				<MenuButton navigation={this.props.navigation}/>
				<View style={{alignContent: 'center', width: '100%'}}>
					<Text style={Styles.screenTitle}>I n t e r e s t s</Text>
				</View>
				<ScrollView contentContainerStyle={styles.container}>
					{errCtrl}
					{msgCtrl}
					<Grid style={{marginRight: 10}}>
						<Row size={1}>
							<Col size={3}><Text style={styles.rowHeader}>Select Categories</Text></Col>
						</Row>
						{rows}
					</Grid>
					<View>
						<Button
							color={'#003459'}
							title={'Save'}
							raised={true}
							onPress={this.onSave.bind(this)}/>
					</View>
				</ScrollView>
			</View>
		)
	}

	/**
	 *
	 * @param category
	 * @param hasInterest
	 * @returns <Row>
	 */
	renderRow(category, hasInterest) {

		const updateUserInterest = this.updateUserInterest.bind(this);
		return (
			<Row size={1} key={category.id} style={[styles.formRow, localStyles.rowContainer]}>
				<Col size={2} style={styles.formRow}>
					<Text>
						{entities.decode(category.name)}
					</Text>
				</Col>
				<Col size={1} style={[styles.formInputSwitch, {backgroundColor: '#e0eaf6'}]}>
					<Switch
						onValueChange={(hasInterest) => {
							updateUserInterest(category.id, hasInterest)
						}}
						value={hasInterest}
					/>
				</Col>
			</Row>
		)
	}
};
