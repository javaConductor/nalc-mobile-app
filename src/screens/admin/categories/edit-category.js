// EditCategory.js
import React from 'react'
import {Button, StyleSheet, Text, TextInput, View} from 'react-native'
import categoryService from '../../../services/categories';
import {AutoGrowingTextInput} from "react-native-autogrow-textinput";


export default class EditCategory extends React.Component {
	static navigationOptions = {
		title: 'Category Details',
	};

	/*
	category {name, slug, description}
	 */
	constructor(props) {
		super(props);
		const category = props.navigation.state.params.category || {};
		console.log(`EditCategory(${JSON.stringify(category)})`);
		this.state = {category};
	}

	update(name, value) {
		console.log(`update: ${name} -> ${value}`);
		const category = {...this.state.category, [name]: value};
		this.setState((prevState) => ({...prevState, category}));
	}

	async onSave(category) {
		console.log(`EditCategory.onSave: Saving category: ${JSON.stringify(category)}`);

		const p = (category.id)
			? categoryService.updateCategory(category)
			: categoryService.addCategory(category);
		p.then((savedCategory) => {
			console.log(`EditCategory.onSave: Saved category: ${JSON.stringify(savedCategory)}`);
			this.props.navigation.navigate('ManageCategories', {});
		})
			.catch((err) => {
				console.error(`EditCategory.onSave: Error: ${JSON.stringify(err)})`);
				if (typeof err === 'object' && (err.authenticationRequired || err.badToken)) {
					this.props.navigation.navigate("Login", {target: "ManageCategories"});
				}
				// throw err;
			});
	}

	render() {
		const {category = {}} = this.state;
		console.log(`EditCategory.render: category:${JSON.stringify(category)}`);

		/// Email error indicator
		const hasValidEntries = category.name && category.name.trim().length > 0;

		return <View style={styles.container}>
			<Text style={{color: 'white'}}>{category.id ? 'Edit' : 'Add'} Category</Text>
			<View style={styles.form}>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Name</Text>
					</View>
					<View style={styles.formInput}>
						<Text style={styles.formInput}>
							<TextInput
								style={styles.formInput}
								value={category.name}
								onChangeText={this.update.bind(this, 'name')}/>
						</Text>
					</View>
				</View>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Description</Text>
					</View>
					<View style={styles.formInput}>
						<Text style={styles.formInput}>
							<AutoGrowingTextInput
								style={styles.formInput}
								value={category.description}
								onChangeText={this.update.bind(this, 'description')}/>
						</Text>
					</View>
				</View>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Slug</Text>
					</View>
					<View style={styles.formInput}>
						<Text style={styles.formInput}>
							<TextInput
								style={styles.formInput}
								value={category.slug}
								onChangeText={this.update.bind(this, 'slug')}/>
						</Text>
					</View>
				</View>
				<View>
					<Button
						disabled={!hasValidEntries}
						title={'Save'}
						raised={true}
						onPress={() => this.onSave(this.state.category)}/>
				</View>
			</View>

		</View>
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		//justifyContent: 'center',
		//alignItems: 'center',
		backgroundColor: 'navy',
		width: '100%'

	},
	form: {
		flex: 1,
		flexDirection: 'column',
		//backgroundColor: 'navy',
		// color: 'white'
	},
	formLabel: {// View
		flex: 1,
		//flexDirection: 'col',

		backgroundColor: 'white',
		// color: 'white',
		width: '50%'
	},
	formValue: {//View
		flex: 1,
		//flexDirection: 'col',
		// color: 'navy',
		borderRadius: 4,
		borderWidth: 0.5,
		borderColor: 'navy',
		backgroundColor: 'white',
		width: '50%'
	},
	formName: {
		//flexDirection: 'col',
		backgroundColor: 'navy',
		// color: 'white',
		// width: '50%'
	},
	formInput: {
		flex: 1,
		//flexDirection: 'col',
		// color: 'navy',
		borderColor: 'navy',
		borderWidth: 1,

		backgroundColor: 'white',
		width: '100%'
	},
	formEmailInput: {
		flex: 1,
		borderWidth: 1,
		backgroundColor: 'white',
		width: '100%'
	},
	formRow: {
		margin: 2,
		flexDirection: 'row',
//		justifyContent : 'space-between',
		justifyContent: 'stretch',
		// color: 'white'
	},
	formPassword: {
		//flexDirection: 'col',
		backgroundColor: 'navy',
		// color: 'white',
		// width: '50%'
	},
});