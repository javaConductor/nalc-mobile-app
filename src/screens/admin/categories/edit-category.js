// EditCategory.js
import React from 'react'
import {Button, Text, TextInput, View} from 'react-native'
import categoryService from '../../../services/categories';
import {AutoGrowingTextInput} from "react-native-autogrow-textinput";
import {NavigationEvents} from "react-navigation";
import util from '../../../services/util';
import styles from "../../main-styles";


export default class EditCategory extends React.Component {
	static navigationOptions = {
		title: 'Category Details',
	};

	/*
	category {name, slug, description}
	 */
	constructor(props) {
		super(props);
		const category = props.navigation.state.params?.category || {};
		console.log(`EditCategory(${JSON.stringify(category)})`);
		this.state = {category};
		this._mounted = false;
	}

	componentDidMount() {
		this._mounted = true;
		const category = this.props.navigation.state.params?.category || {};
		console.log(`EditCategory.componentDidMount: category: ${JSON.stringify(category)})`);

		this.setState((prevState) => {
			return {...prevState, category}
		});
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	update(name, value) {
		console.log(`update: ${name} -> ${value}`);
		const category = {...this.state.category, [name]: value};
		this.setState((prevState) => ({...prevState, category}));
	}

	async onSave(category) {
		console.log(`EditCategory.onSave: Saving category: ${JSON.stringify(category)}`);
		try {
			const savedCategory = await ((category.id)
				? categoryService.updateCategory(category)
				: categoryService.addCategory(category));
			console.log(`EditCategory.onSave: Saved category: ${JSON.stringify(savedCategory)}`);
			this.props.navigation.navigate('Categories', {});
		} catch (err) {
			console.error(`EditCategory.onSave: Error: ${util.errorMessage(err)})`);
			if (typeof err === 'object' && (err.authenticationRequired || err.badToken)) {
				this.props.navigation.navigate("Login", {target: "ManageCategories"});
			}
			// throw err;
		}
	}

	render() {
		const {category = {}} = this.state;
		console.log(`EditCategory.render: category:${JSON.stringify(category)}`);

		/// Email error indicator
		const hasValidEntries = category.name && category.name.trim().length > 0;

		return <View style={styles.container}>
			<NavigationEvents onDidFocus={this.componentDidMount.bind(this)}/>
			<Text style={{color: 'white'}}>{category.id ? 'Edit' : 'Add'} Category</Text>
			<View style={styles.form}>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Name</Text>
					</View>
					<View style={styles.formInput}>
							<TextInput
								style={[styles.formInput, {borderWidth: 1}]}
								value={category.name}
								onChangeText={this.update.bind(this, 'name')}/>
					</View>
				</View>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Description</Text>
					</View>
					<View style={styles.formInput}>
						<AutoGrowingTextInput
							style={[styles.formInput, {borderWidth: 1}]}
							value={category.description}
							onChangeText={this.update.bind(this, 'description')}/>
					</View>
				</View>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Slug</Text>
					</View>
					<View style={styles.formInput}>
						<TextInput
							style={[styles.formInput, {borderWidth: 1}]}
							value={category.slug}
							onChangeText={this.update.bind(this, 'slug')}/>
					</View>
				</View>
				<View>
					<Button
						color={'navy'}
						style={styles.button}
						disabled={!hasValidEntries}
						title={'Save'}
						raised={true}
						onPress={() => this.onSave(this.state.category)}/>
				</View>
			</View>

		</View>
	}
}
