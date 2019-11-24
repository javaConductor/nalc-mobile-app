// UploadArticle.js
import React from 'react'
import {Button, StyleSheet, Switch, Text, View} from 'react-native'
import TextInput from "react-native-web/dist/exports/TextInput";
import categoryService from '../../services/categories';
import mainStyles from '../main-styles';
import newsService from '../../services/news';
import {Col, Grid, Row} from "react-native-easy-grid";


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
				console.log(`UploadArticle.componentDidMount: ERROR: ${error}`);
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
		console.log(`selectedIdList: keys: ${JSON.stringify(keys, null, 2)}`);
		console.log(`selectedIdList: selected: ${JSON.stringify(selectedCategories, null, 2)}`);

		/// keys are category ids
		return keys.filter((categorySelection) => selectedCategories[categorySelection]);
	}

	async onSave() {
		const {navigate} = this.props.navigation;
		const {content, url, title} = this.state;
		const categories = this.selectedIdList(this.state.selectedCategories);
		const contentLink = `<a target='_blank' href='${url}'> Link...</a>`;
		try {
			await newsService.addNewsPost({content: contentLink, title, categories});
			const selectedCategories = this.createSelectedCategories(this.state.categories);
			this.setState((prevState) => ({
				...prevState,
				message: `Article '${title}' uploaded`,
				url: null,
				content: null,
				title: null,
				selectedCategories
			}));
		} catch (e) {
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
			<View style={{flex: 1}}>
				{msgCtrl}
				<Grid style={{flexDirection: 'row', justifyContent: 'space-between'}}>
					<Col size={2}>
						{/*<View style={styles.leftSide}>*/}
						<Row size={1}>
							<Col size={1}>
								<View style={styles.formLabel}>
									<Text>Title</Text>
								</View>
							</Col>
							<Col size={3}>
								<View style={styles.formInput}>
									<Text style={styles.formInput}>
										<TextInput style={{borderWidth: 4, borderColor: 'black'}}
										           value={title}
										           onChangeText={this.updateTitle.bind(this)}/>
									</Text>
								</View>
							</Col>
						</Row>
						<Row size={1}>
							{/*<View style={styles.formRow}>*/}
							<Col size={1}>
								<View style={styles.formLabel}>
									<Text>URL</Text>
								</View>
							</Col>
							<Col size={3}>
								<View style={styles.formInput}>
									<Text style={styles.formInput}>
										<TextInput style={{borderWidth: 4, borderColor: 'black'}}
										           value={url}
										           onChangeText={this.updateUrl.bind(this)}/>
									</Text>
								</View>
							</Col>
							{/*</View>*/}

						</Row>
						<Row size={5}/>
						{/*</View>*/}
					</Col><Col size={2}>
					{/*<View style={styles.rightSide}>*/}
					{this.renderCategoryChoices()}
					{/*</View>*/}
				</Col>
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
				<Col size={2}>
					<View style={styles.formLabel}>
						<Text style={{alignSelf: 'flex-start'}}>{category.name}</Text>
					</View>
				</Col>

				<Col size={1}/>
			</Row>
		)
	}
}

const localStyles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		// justifyContent: 'space-between'
	},
	leftSide: {
		alignSelf: 'flex-start',
		justifyContent: 'center',
		width: '30%'
	},
	rightSide: {
		alignSelf: 'flex-end',
		justifyContent: 'center',
		width: '70%'
	},
	item: {
		flex: 1,
		height: 160,
		margin: 1
	},
	list: {
		flex: 1
	}
});

const styles = StyleSheet.compose(mainStyles, localStyles);
