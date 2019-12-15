// UploadArticle.js
import React from 'react'
import {Button, ScrollView, Switch, Text, TextInput, View} from 'react-native'
import categoryService from '../../services/categories';
import newsService from '../../services/news';
import {Col, Grid, Row} from "react-native-easy-grid";
import util from "../../services/util";
import styles from '../main-styles';


export default class UploadArticle extends React.Component {
	static navigationOptions = {
		//title: 'Upload Article',
		header: null
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

		console.log(`UploadArticle.componentDidMount: routes: ${util.getAvailableRoutes(this.props.navigation)}`);

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
				this.setState((prevState) => ({
					...prevState,
					message: `Error uploading article: ${util.errorMessage(e)}`
				}));
			if (typeof e === 'object' && (e.authenticationRequired || e.badToken)) {
				navigate("Login", {target: "UploadArticle"});
			}
		}
	}

	render() {
		const urlRegex = /(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/;
		const {title, url, selectedCategories} = this.state;
		const goodURL = urlRegex.test(url);
		console.log(`UploadArticle.render: ${url} ${goodURL ? "Good URL" : "URL NO GOOD"}!`);
		const selected = this.selectedIdList(selectedCategories);
		const canSave = goodURL && title && title.trim().length > 0 && url && url.trim().length > 0 && selected.length > 0;
		const msgCtrl = this.state.message ? <Text>{this.state.message}</Text> : null;
		return (
			<View style={[styles.container]}>
				{/*//<View style={styles.container}>*/}
				<Text style={styles.homeLabel}>U p l o a d A r t i c l e</Text>
				{msgCtrl}
				<ScrollView>
					<Grid
						style={{flexDirection: 'column', justifyContent: 'space-around', flexGrow: 2, marginLeft: 10}}>
						<Row>
							<Col size={2}>
								<View style={styles.formLabel}>
									<Text>Title</Text>
								</View>
							</Col>
							<Col size={6}>
								<View style={{...styles.formInput}}>
									<TextInput style={[styles.formInput, {borderWidth: 2, borderColor: 'black'}]}
									           value={title}
									           onChangeText={this.updateTitle.bind(this)}/>
								</View>
							</Col>
						</Row>
						<Row style={{marginBottom: 10}}>
							<Col size={2}>
								<View style={styles.formLabel}>
									<Text>URL</Text>
								</View>
							</Col>
							<Col size={6}>
								<View style={{...styles.formInput}}>
									<TextInput style={[styles.formInput, {borderWidth: 2, borderColor: 'black'}]}
									           value={url}
									           onChangeText={this.updateUrl.bind(this)}/>
								</View>
							</Col>
						</Row>
						<View style={{marginLeft: 15, alignContent: 'center'}}>
							{this.renderCategoryChoices()}
						</View>
					</Grid>
					<Button color={'navy'} disabled={!canSave} title={'Save'} onPress={this.onSave.bind(this)}/>
				</ScrollView>
			</View>
		)
	}

	renderCategoryChoices() {
		const selectedCategories = this.state.selectedCategories;
		return this.state.categories.map((cat) => {
			const inCategory = selectedCategories[cat.id];
			return this.renderRow(cat, inCategory);
		});
	}

	renderRow(category, inCategory) {
		const updateSelectedCategories = this.updateSelectedCategories.bind(this);
		return (
			<Row key={category.id} style={{marginLeft: 15,}}>
				<Col size={10}>
					<View style={styles.formLabel}>
						<Text style={{alignSelf: 'flex-start'}}>{category.name}</Text>
					</View>
				</Col>
				<Col size={2}>
					{/*<View style={styles.formValue}> */}
					<Switch style={styles.formValue}
					        onValueChange={(isInCategory) => {
						        updateSelectedCategories(category.id, isInCategory)
					        }}
					        value={inCategory}
					/>
					{/*</View>*/}
				</Col>
				<Col size={1}/>
			</Row>
		)
	}
}
