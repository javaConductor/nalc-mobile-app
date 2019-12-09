// ManageAdmins.js
import React from 'react'
import {Button, StyleSheet, Text, View} from 'react-native'
import Users from '../../services/users';
import {NavigationEvents, withNavigation} from 'react-navigation';
import {Col, Grid, Row} from "react-native-easy-grid";
import util from "../../services/util";


class ManageAdmins extends React.Component {
	static navigationOptions = {
		title: 'Manage Administrators',
	};
	state = {
		admins: undefined,
		isLoading: true,
		errorLoading: false
	};

	constructor(props) {
		console.log(`ManageAdmins.constructor(props: ${JSON.stringify(props)})`);
		super(props);
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
			{msgCtrl}
			<Grid>
				<Row>
					<Col size={5}>
						<Text style={styles.rowHeader}>Administrator Name</Text>
					</Col>
					<Col size={1}>
						<Text style={styles.rowHeader}>Actions</Text>
					</Col>
				</Row>
				{adminList}
				<Button
					style={{alignSelf: 'center'}}
					title={"Add New Administrator"}
					onPress={() => {
						navigate('EditAdmin', {})
					}}/>
			</Grid>
		</View>
	}

	renderAdmin(admin, props) {
		//console.log(`ManageAdmins.renderAdmin: props: ${JSON.stringify(props)}`);
		//console.log(`ManageAdmins.renderAdmin: state: ${JSON.stringify(this.state)}`);
		//console.log(`ManageAdmins.renderAdmin(${JSON.stringify(admin)})`);
		const {navigate} = props.navigation;
		const {firstName, lastName} = admin;
		return (
			<Row key={admin.id}>
				<Col size={5} style={styles.rowCol}>
					<Text onPress={() => {
						navigate('EditAdmin', {admin})
					}}>
						{`${firstName} ${lastName}`}
					</Text>
				</Col>
				<Col size={1} style={styles.rowCol}>
					<Button
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		justifyContent: 'center',
		//alignItems: 'stretch',
		borderWidth: 1,
	},
	adminRow: {
		flex: 1,
		flexDirection: 'row'
	},
	adminName: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		width: '80%'
	},
	adminActions: {
		justifyContent: 'flex-end',
		width: '20%',
		flexDirection: 'row'
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	rowCol: {
		borderWidth: 1,
		borderColor: 'black'
	},

	rowHeader: {
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	header: {
		fontWeight: 'bold',
		fontSize: 18,
		alignSelf: 'center',
	}
});