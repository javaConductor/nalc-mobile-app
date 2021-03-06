// ManageCategories.js
import React from 'react'
import {Button, ScrollView, Text, View} from 'react-native'
import categoryService from '../../services/categories';
import {NavigationEvents} from "react-navigation";
import {Col, Grid, Row} from "react-native-easy-grid";
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import util from "../../services/util";
import styles from '../main-styles';
import MenuButton from "../../components/menu/menu-button";
import {XmlEntities as Entities} from 'html-entities';


const entities = new Entities();

export default class ManageCategories extends React.Component {
	static navigationOptions = {
		//title: 'Manage Categories',
		header: null
	};

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true
		};
		console.log(`ManageCategories.constructor: routes: ${util.getAvailableRoutes(this.props.navigation)}`);

	}

	componentWillUnmount() {
		this.mounted = false;
	}

	async componentDidMount() {
		this.mounted = true;
		this.setState((prevState) => {
			return {...prevState, isLoading: true}
		});
		const {navigate} = this.props.navigation;
		try {
			const categories = await categoryService.getCategories();
			//console.log(`ManageCategories.componentDidMount: categories: (${JSON.stringify(categories)})`);

			if (this.mounted)
				this.setState((prevState) => {
					return {...prevState, isLoading: false, categories}
				});
		} catch (e) {
			console.error(`ManageCategories.componentDidMount: Error getting categories: ${util.errorMessage(e)}`);
			if (typeof e === 'object' && (e.authenticationRequired || e.badToken)) {
				navigate("Login", {target: "ManageCategories"});
			}
		}
	}

	render() {
		if (this.state.isLoading)
			return null;
		const {navigate} = this.props.navigation;
		//console.log(`ManageCategories.render: categoryService: (${JSON.stringify(this.state.categoryService)})`);

		return (
			<View style={styles.container}>
				<NavigationEvents onWillFocus={this.componentDidMount.bind(this)}/>
				<MenuButton navigation={this.props.navigation}/>
				<View style={{alignContent: 'center', width: '100%'}}>
					<Text style={styles.screenTitle}>C a t e g o r i e s</Text>
				</View>
				<ScrollView>
					<Grid>
						<Row style={{marginBottom: 10}}>
							<Col size={1}><Text style={styles.rowHeader}>Name</Text></Col>
							{/*<Col size={1}><Text>Slug</Text></Col>*/}
							<Col size={2}>
								<Text style={styles.rowHeader}>Description</Text>
							</Col>
						</Row>
						{this.state.categories.map(this.renderRow.bind(this))}
					</Grid>
					<Button style={{alignSelf: 'flex-start'}} color={'#003459'}
					        onPress={() => navigate('EditCategory', {})} title={"Add New Category"}/>
				</ScrollView>
			</View>
		)
	}

	onRemove(categoryId) {

	}

	renderRow(category) {
		const {navigate} = this.props.navigation;

		return (<Row key={category.id} style={{borderColor: 'navy', borderTopWidth: 2}}>
				<Col style={{...styles.rowCol, borderRightWidth: 2}} size={1}>
					<Text
						onPress={() => navigate('EditCategory', {category})}>
						{entities.decode(category.name)}
					</Text>
				</Col>
				{/*<Col  size={1}><Button title={category.slug} onPress={() => navigate('EditCategory', {category})}/></Col>*/}
				<Col style={styles.rowCol} size={2}>
					<AutoGrowingTextInput
						value={category.description}
						onClick={() => navigate('EditCategory', {category})}/>
				</Col>
			</Row>
		);

	}

	addNewCategory() {

	}
}
//
// const mainStyles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		width: '100%',
// 		justifyContent: 'center',
// 		alignItems: 'stretch',
// 		borderWidth: 1,
// 	},
// 	row: {
// 		flex: 1,
// 		flexDirection: 'row',
// 		justifyContent: 'space-between'
// 	},
// 	rowCol: {
// 		borderWidth: 1,
// 		borderColor: 'black'
// 	},
//
// 	rowHeader: {
// 		fontWeight: 'bold',
// 		alignSelf: 'center',
// 	},
// 	header: {
// 		fontWeight: 'bold',
// 		fontSize: 18,
// 		alignSelf: 'center',
// 		borderBottom: 5,
// 		borderBottomColor: 'navy',
// 	}
// });
