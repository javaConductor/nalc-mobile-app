// ManageAdmins.js
import React from 'react'
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native'
import Users from '../../services/users';
import {NavigationEvents, withNavigation} from 'react-navigation';
import {Col, Grid, Row} from "react-native-easy-grid";
import util from "../../services/util";
import mainStyles from '../main-styles';


class ManageAdmins extends React.Component {
	static navigationOptions = {
		title: 'Administrators',
		header: null
	};
	state = {
		admins: undefined,
		isLoading: true,
		errorLoading: false
	};

	constructor(props) {
		console.log(`ManageAdmins.constructor(props: ${JSON.stringify(props)})`);
		super(props);
		console.log(`ManageAdmins.constructor : routes: ${util.getAvailableRoutes(this.props.navigation)}`);

	}

	async componentDidMount() {
		console.log("ManageAdmins.componentDidMount");
		try {
			//console.log(`ManageAdmins.componentDidMount(): this.props.navigation: (${JSON.stringify(this.props.navigation, null, 2)})`);
			const admins = this.props.navigation?.state?.params?.admins || await Users.getAdmins();
			console.log(`ManageAdmins.componentDidMount(): admins: (${JSON.stringify(admins, null, 2)})`);
			this.setState({admins, isLoading: false});
		} catch (e) {
			console.error(`ManageAdmins.componentDidMount(): error: ${util.errorMessage(e)}`);
			this.setState({...this.state, errLoading: true, error: e});
		}
	}

	renderError(e) {
		return (<Text>
				Error loading admin list {e}
			</Text>
		)
	}

	renderLoading() {
		return null;
	}

	render() {
		const {admins = [], isLoading, errLoading, error} = this.state;

		if (errLoading)
			return this.renderError(error);
		if (isLoading)
			return this.renderLoading();
		const {navigate} = this.props.navigation;
		const adminList = admins.map((admin) => this.renderAdmin(admin, this.props));
		const msgCtrl = this.state.message ? <Text>{this.state.message}</Text> : null;
		return <View style={styles.container}>
			<NavigationEvents onWillFocus={this.componentDidMount.bind(this)}/>
			<Text style={{
				width: '100%',
				backgroundColor: 'navy',
				color: 'white',
				fontSize: 20,
				fontWeight: '900',
				alignSelf: 'flex-start'
			}}>M a n a g e A d m i n i s t r a t o r s</Text>
			{msgCtrl}
			<Grid>
				<Row style={{marginBottom: 10}}>
					<Col size={3}>
						<Text style={{
							fontWeight: 'bold',
							alignSelf: 'center',
							fontSize: 20,
						}}>Administrator Name</Text>
					</Col>
					<Col size={1}>
						<Text style={{
							fontWeight: 'bold',
							alignSelf: 'center',
							fontSize: 20,
						}}>Actions</Text>
					</Col>
				</Row>
				<ScrollView>{adminList}</ScrollView>
				<Button color={'navy'}
				        style={{alignSelf: 'center'}}
				        title={"Add New Administrator"}
				        onPress={() => {
					        navigate('EditAdmin', {})
				        }}/>
			</Grid>
		</View>
	}

	renderAdmin(admin, props) {
		//console.log(`ManageAdmins.renderAdmin(${JSON.stringify(admin)})`);
		const {navigate} = props.navigation;
		const {firstName, lastName} = admin;
		return (
			<Row style={{borderTopWidth: 2}} key={admin.id}>
				<Col size={3} style={styles.rowCol}>
					<Text onPress={() => {
						navigate('EditAdmin', {admin})
					}}>
						{`${firstName} ${lastName}`}
					</Text>
				</Col>
				<Col size={1} style={styles.rowCol}>
					<Button
						color={'navy'}
						title={'Remove'}
						onPress={() => this.onRemoveAdmin(admin)}/>
				</Col>
			</Row>
		);
	}

	async onRemoveAdmin(admin) {
		const {navigate} = this.props.navigation;
		console.log(`ManageAdmins.onRemoveAdmin(${JSON.stringify(admin, null, 2)})`);

		const newList = await Users.removeAdmin(admin.id);
		this.setState((prevState) => {
			return {...prevState, admins: newList}
		});
		console.log(`ManageAdmins.onRemoveAdmin(${JSON.stringify(admin, null, 2)}): newList: (${JSON.stringify(newList, null, 2)})`);
		navigate('ManageAdmins', {admins: newList});
	}
}

export default withNavigation(ManageAdmins);

const localStyles = StyleSheet.create({});

const styles = StyleSheet.compose(mainStyles, localStyles);
