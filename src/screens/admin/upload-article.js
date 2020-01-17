// UploadArticle.js
import React from 'react'
import {Button, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View} from 'react-native';

import categoryService from '../../services/categories';
import newsService from '../../services/news';
import {Col, Grid, Row} from "react-native-easy-grid";
import util from "../../services/util";
import styles from '../main-styles';
import MenuButton from "../../components/menu/menu-button";
import * as ImagePicker from 'expo-image-picker';
import {NavigationEvents} from "react-navigation";


const localStyles = StyleSheet.create({

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
			uri: null,
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
//				const message = typeof error === 'object' ? error.message : error;
				console.error(`UploadArticle.componentDidMount: ERROR: ${util.errorMessage(error)}`);
				this.setState((prevState) => ({
					...prevState,
					errorMessage: `${util.errorMessage(error)}`
				}));
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
		//console.log(`UploadArticle.updateSelectedCategories: selectedCategories ${JSON.stringify(selectCats, null, 2)} `);
		this.setState((prevState) => ({...prevState, selectedCategories: selectCats}));
	}

	selectedIdList(selectedCategories) {
		const keys = Object.keys(selectedCategories);
		//console.log(`selectedIdList: keys: ${JSON.stringify(keys, null, 2)}`);
		//console.log(`UploadArticle.selectedIdList: selected: ${JSON.stringify(selectedCategories, null, 2)}`);

		/// keys are category ids
		return keys.filter((categorySelection) => selectedCategories[categorySelection]);
	}

	clearImage() {
		this.setState((prevState) => ({...prevState, image: {}}));
	}

	_pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			base64: true,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		});

//		console.log(`UploadArticle._pickImage: picker result uri size:  ${result.uri.length}`);
		console.log(`UploadArticle._pickImage: result:  ${JSON.stringify({...result, base64: null})}`);
		//result.base64 && console.log(`UploadArticle._pickImage: base64:  ${JSON.stringify(result.base64.substr(0, 100))}`);

		if (!result.cancelled) {
			const {uri, base64} = result;
			this.setState({image: {uri, base64}});
		}
	};

	onBlur() {
		this.setState((prevState) => {
			return {...prevState, message: null, errorMessage: null, image: null}
		});
	}

	async onSave() {
		const {url, title, image} = this.state;
		console.log(`UploadArticle.onSave: Saving Article ${title}`);
		this.setState((prevState) => ({...prevState, isSaving: true}));
		const {navigate} = this.props.navigation;
		const {uri} = image;
		const categories = this.selectedIdList(this.state.selectedCategories);
		const contentLink = `<a target='_blank' href='${url}'> Link...</a>`;
		if (this.mounted)
			this.setState((prevState) => ({
				...prevState,
				errorMessage: null,
				message: null,
			}));
		try {
			const response = await newsService.addNewsPost({content: contentLink, title, categories, image});
			console.log(`UploadArticle.onSave: response: ${JSON.stringify(response)}`);
			if (response.errorMessage) {
				throw response;
			}
			const selectedCategories = this.createSelectedCategories(this.state.categories);
			if (this.mounted)
				this.setState((prevState) => ({
					...prevState,
					message: `Article '${title}' uploaded`,
					url: '',
					content: '',
					title: '',
					isSaving: false,
					selectedCategories
				}));
		} catch (e) {
			console.error(`UploadArticle.onSave: Error saving post: ${util.errorMessage(e)}`);
			if (this.mounted)
				this.setState((prevState) => ({
					...prevState,
					isSaving: false,
					errorMessage: `Error uploading article: ${util.errorMessage(e)}`
				}));
			if (typeof e === 'object' && (e.authenticationRequired || e.badToken)) {
				navigate("Login", {target: "UploadArticle"});
			}
		}
	}

	render() {
		const {title, url, selectedCategories, image, message, errorMessage, isSaving} = this.state;
		const {uri} = image || {};
		const goodURL = util.validURL(url);
		console.log(`UploadArticle.render: '${url}' ${goodURL ? "Good URL" : "URL NO GOOD"}!`);
		const selected = this.selectedIdList(selectedCategories);
		const canSave = goodURL && title && title.trim().length > 0 && url && url.trim().length > 0 && selected.length > 0;
		const msgCtrl = message ? <Text style={styles.message}>{message}</Text> : null;
		const errorCtrl = errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null;
		return (
			<View style={[styles.container]}>
				<NavigationEvents
					onDidBlur={this.onBlur.bind(this)}
				/>
				{/*//<View style={styles.container}>*/}
				<MenuButton navigation={this.props.navigation}/>
				<View style={{alignContent: 'center', width: '100%'}}>
					<Text style={styles.screenTitle}>P u b l i s h A r t i c l e</Text>
				</View>
				{msgCtrl}
				{errorCtrl}
				<ScrollView style={{marginTop: 10, marginRight: 5}}>
					<Grid
						style={{flexDirection: 'column', justifyContent: 'space-around', flexGrow: 2, marginLeft: 10}}>
						<Row>
							<Col size={6}>
								<View style={[styles.formInput, {backgroundColor: '#e0eaf6'}]}>
									<TextInput style={[
										styles.formInput,
										{borderWidth: 2, borderColor: 'black'}
									]}
									           placeholder={'Enter Title'}
									           value={title}
									           onChangeText={this.updateTitle.bind(this)}/>
								</View>
							</Col>
						</Row>
						<Row style={{marginBottom: 10}}>
							<Col size={6}>
								<View style={{...styles.formInput}}>
									<TextInput style={[styles.formInput, {borderWidth: 2, borderColor: 'black'}]}
									           value={url}
									           placeholder={'Enter URL'}
									           onChangeText={this.updateUrl.bind(this)}/>
								</View>
							</Col>
						</Row>
						<Row style={{marginBottom: 10,}}>
							<Col>
								<View
									style={[
										styles.formInput,
										{
											flexDirection: 'row',
											justifyContent: 'space-around',
											backgroundColor: '#e0eaf6'
										}]}>
									<TouchableOpacity
										style={localStyles.button}
										onPress={this._pickImage}
										underlayColor='#fff'>
										<Text style={localStyles.buttonText}>Select&nbsp;Image</Text>
									</TouchableOpacity>
									<View><Text>&nbsp;&nbsp;&nbsp;</Text></View>
								</View>
							</Col>
							<Col>
								<View>
									{uri && <TouchableOpacity
										style={localStyles.button}
										onPress={this.clearImage.bind(this)}
										underlayColor='#fff'>
										<Text style={localStyles.buttonText}>Clear&nbsp;Image</Text>
									</TouchableOpacity>}
								</View>
							</Col>

						</Row>
						{uri &&
						<Row style={{minHeight: 200,}}>
							<Image source={{uri: uri}} style={{resizeMode: 'center', width: '100%'}}/>
						</Row>}
						<View style={{marginLeft: 15, alignContent: 'center'}}>
							{this.renderCategoryChoices()}
						</View>
					</Grid>
					<Button
						color={'#003459'}
						disabled={!canSave || isSaving}
						title={'Publish'}
						onPress={this.onSave.bind(this)}/>
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
					<View style={[
						styles.formLabel,
						{backgroundColor: '#e0eaf6'}]}>
						<Text style={{alignSelf: 'flex-start'}}>{category.name}</Text>
					</View>
				</Col>
				<Col size={2}>
					{/*<View style={styles.formValue}> */}
					<Switch style={[styles.formValue, {backgroundColor: '#e0eaf6'}]}
					        onValueChange={(isInCategory) => {
						        updateSelectedCategories(category.id, isInCategory)
					        }}
					        value={inCategory}
					/>
				</Col>
				<Col size={1}/>
			</Row>
		)
	}

}

