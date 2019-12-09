// UploadArticle.js
import React from 'react'
import {Button, Switch, Text, TextInput, View} from 'react-native'
import categoryService from '../../services/categories';
import newsService from '../../services/news';
import {Col, Grid, Row} from "react-native-easy-grid";
import util from "../../services/util";
import styles from '../main-styles';


export default class UploadArticle extends React.Component {
	static navigationOptions = {
		title: 'Upload Article',
	};

	constructor(props) {
		super(props);
		this.state = {
			title: undefined,
			url: undefined,
			selectedCategories: {},//{categoryId: true/false}
			categories: []// name, id
		}
	}

	async componentDidMount() {
		this.mounted = true;
		return categoryService.getCategories()
			.then((categories) => {
				const selectedCategories = this.createSelectedCategories(categories);
				if (this.mounted)
					this.setState((prevState) => {
						return {...prevState, categories, selectedCategories}
					});
			})
			.catch((error) => {
				const message = typeof error === 'object' ? error.message : error;
				console.error(`UploadArticle.componentDidMount: ERROR: ${util.errorMessage(error)}`);
				throw error;
			});
	}

	createSelectedCategories(categories) {
		return categories.reduce((acc, cat) => {
			return {...acc, [cat.id]: false}
		}, {});
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	updateTitle(title) {
		this.setState((prevState) => ({...prevState, title: title}));
	}

	updateUrl(url) {
		this.setState((prevState) => ({...prevState, url: url.trim()}));
	}

	updateSelectedCategories(categoryId, selected) {
		const selectCats = {...this.state.selectedCategories, [categoryId]: selected};
		console.log(`UploadArticle.updateSelectedCategories: selectedCategories ${JSON.stringify(selectCats, null, 2)} `);
		this.setState((prevState) => ({...prevState, selectedCategories: selectCats}));
	}

	selectedIdList(selectedCategories) {
		const keys = Object.keys(selectedCategories);
		//console.log(`selectedIdList: keys: ${JSON.stringify(keys, null, 2)}`);
		console.log(`UploadArticle.selectedIdList: selected: ${JSON.stringify(selectedCategories, null, 2)}`);

		/// keys are category ids
		return keys.filter((categorySelection) => selectedCategories[categorySelection]);
	}

	async onSave() {
		const {navigate} = this.props.navigation;
		const {url, title} = this.state;
		const categories = this.selectedIdList(this.state.selectedCategories);
		const contentLink = `<a target='_blank' href='${url}'> Link...</a>`;
		try {
			await newsService.addNewsPost({content: contentLink, title, categories});
			const selectedCategories = this.createSelectedCategories(this.state.categories);
			if (this.mounted)
				this.setState((prevState) => ({
					...prevState,
					message: `Article '${title}' uploaded`,
					url: '',
					content: '',
					title: '',
					selectedCategories
				}));
		} catch (e) {
			console.error(`UploadArticle.onSave: Error saving post: ${util.errorMessage(e)}`);
			if (this.mounted)
				this.setState((prevState) => ({...prevState, message: `Error uploading article: ${e}`}));
			if (typeof e === 'object' && (e.authenticationRequired || e.badToken)) {
				navigate("Login", {target: "UploadArticle"});
			}
		}
	}

	render() {
		const {title, url, selectedCategories} = this.state;
		const selected = this.selectedIdList(selectedCategories);
		const canSave = title && title.trim().length > 0 && selected.length > 0;
		const msgCtrl = this.state.message ? <Text>{this.state.message}</Text> : null;
		return (
			<View style={{flex: 4, flexGrow: 2,}}>
				<Text style={styles.rowHeader}>U p l o a d A r t i c l e</Text>
				{msgCtrl}
				<Grid style={{flexDirection: 'col', justifyContent: 'space-between', flexGrow: 2}}>
					<Row size={1}>
						<Col size={1}>
							<View style={styles.formLabel}>
								<Text>Title</Text>
							</View>
						</Col>
						<Col size={6}>
							<View style={{...styles.formInput}}>
								<Text style={{...styles.formInput}}>
									<TextInput style={{borderWidth: 2, borderColor: 'black'}}
									           value={title}
									           onChangeText={this.updateTitle.bind(this)}/>
								</Text>
							</View>
						</Col>
					</Row>
					<Row size={1}>
						<Col size={1}>
							<View style={styles.formLabel}>
								<Text>URL</Text>
							</View>
						</Col>
						<Col size={6}>
							<View style={{...styles.formInput}}>
								<Text style={{...styles.formInput}}>
									<TextInput style={{borderWidth: 2, borderColor: 'black'}}
									           value={url}
									           onChangeText={this.updateUrl.bind(this)}/>
								</Text>
							</View>
						</Col>
					</Row>
					{this.renderCategoryChoices()}
				</Grid>
				<Button disabled={!canSave} title={'Save'} onPress={this.onSave.bind(this)}/>
			</View>
		)
	}

	renderOLD() {
		const {title, url, selectedCategories} = this.state;
		const selected = this.selectedIdList(selectedCategories);
		const canSave = title && title.trim().length > 0 && selected.length > 0;
		const msgCtrl = this.state.message ? <Text>{this.state.message}</Text> : null;
		return (
			<View style={{flex: 1}}>
				{msgCtrl}
				<Grid style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<Row>
						<Col size={1}>
							<View style={styles.formLabel}>
								<Text>Title</Text>
							</View>
						</Col>
						<Col size={2}>
							<View style={{...styles.formInput, alignItems: 'stretch'}}>
								<Text style={{...styles.formInput, alignItems: 'stretch'}}>
									<TextInput style={{borderWidth: 4, borderColor: 'black', alignSelf: 'stretch'}}
									           value={title}
									           onChangeText={this.updateTitle.bind(this)}/>
								</Text>
							</View>
						</Col>
					</Row>
					<Row size={1}>
						<Col size={1}>
							<View style={styles.formLabel}>
								<Text>URL</Text>
							</View>
						</Col>
						<Col size={4}>
							<View style={styles.formInput}>
								<Text style={styles.formInput}>
									<TextInput style={{borderWidth: 4, borderColor: 'black'}}
									           value={url}
									           onChangeText={this.updateUrl.bind(this)}/>
								</Text>
							</View>
						</Col>
					</Row>
					{this.renderCategoryChoices()}
				</Grid>
				<Button disabled={!canSave} title={'Save'} onPress={this.onSave.bind(this)}/>
			</View>
		)
	}

	renderCategoryChoices() {
		const selectedCategories = this.state.selectedCategories;
		return this.state.categories.map((cat) => {
			const inCategory = selectedCategories[cat.id];
			return this.renderRow(cat, inCategory);
			// return <ScrollView style={ {marginTop: 20}}>
			// 	{this.renderRow(cat, inCategory)}
			// </ScrollView>;
		});
	}

	renderRow(category, inCategory) {
		const updateSelectedCategories = this.updateSelectedCategories.bind(this);
		return (
			<Row key={category.id} style={{marginLeft: 5}}>
				<Col size={1}>
					<View style={styles.formValue}>
						<Switch
							onValueChange={(isInCategory) => {
								updateSelectedCategories(category.id, isInCategory)
							}}
							value={inCategory}
						/>
					</View>
				</Col>
				<Col size={10}>
					<View style={styles.formLabel}>
						<Text style={{alignSelf: 'flex-start'}}>{category.name}</Text>
					</View>
				</Col>

				<Col size={1}/>
			</Row>
		)
	}
}
