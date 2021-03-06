// EditAdmin.js
import React from 'react'
import {Button, Switch, Text, View} from 'react-native'
import Users from '../../services/users';
import styles from '../../screens/main-styles';
import utils from '../../services/util';
import {AutoGrowingTextInput} from "react-native-autogrow-textinput";
import {withNavigation} from 'react-navigation';
import PasswordInput from "../../components/password-input";


class EditAdmin extends React.Component {
	static navigationOptions = {
		title: 'Administrator Details',
	};

	constructor(props) {
		super(props);
		const admin = props.navigation.state?.params?.admin || {permissions: 'A', status: 'Active'};
		console.log(`EditAdmin(${JSON.stringify(admin)})`);
		this.state = {admin, password1: '', password2: ''};
	}

	updateManageAdmins(canManage) {
		console.log(`EditAdmin.updateManageAdmins: canManage: ${canManage}`);
		this.setState((prevState) => {
			const {admin} = prevState;
			const permissions = (canManage && !admin.permissions.includes('M')) ? admin.permissions + 'M'
				: (admin.permissions.includes('M') ? utils.removeCharacter('M', admin.permissions) : admin.permissions);
			console.log(`EditAdmin.updateManageAdmins: admin.permissions: ${permissions}`);
			const newAdmin = {...this.state.admin, permissions};
			return {...prevState, admin: newAdmin};
		});
	}

	update(name, value) {
		console.log(`EditAdmin.update: ${name} -> ${value}`);
		const admin = {...this.state.admin, [name]: value};
		this.setState((prevState) => ({...prevState, admin}));
	}

	updatePassword1(password) {
		//console.log(`EditAdmin.updatePassword1: ${password}`);
		this.setState((prevState) => ({...prevState, password1: password}));
	}

	updatePassword2(password) {
		//console.log(`EditAdmin.updatePassword2: ${password}`);
		this.setState((prevState) => ({...prevState, password2: password}));
	}

	async onSave(admin) {
		let newAdmin;
		let newPswd;
		//TODO inefficient
		Users.checkEmailUsed(this.state.admin.id || -1, this.state.admin.email)
			.then((emailAlreadyUsed) => {
				if (emailAlreadyUsed) {
					this.setState((prevState) => {
						return {
							...prevState,
							message: `Email '${this.state.admin.email}' already registered to another user.`
						}
					});
				} else {
					if (this.state.password1.length > 0) {
						const hash = utils.passwordHash(this.state.password1);
						newPswd = this.state.password1;
						newAdmin = {...this.state.admin, passwordHash: hash};
					} else {
						newAdmin = {...this.state.admin, passwordHash: null};
					}
					this.setState((prevState) => ({...prevState, admin: newAdmin}));
					/// Use Users service to save the admin
					console.log(`EditAdmin: Saving admin: ${newPswd ? 'pass: ' + newPswd : ''} ${JSON.stringify(newAdmin)}`);

					const p = Users.saveAdmin(newAdmin);
					p.then((admins) => {
						//this.props.navigation.goBack().goBack();
						console.log(`EditAdmin: Saving admin: response: ${JSON.stringify(admins)}: navigating to ManageAdmins`);
						this.props.navigation.navigate('ManageAdmins', {admins});
					}).catch((err) => {
						console.error(`EditAdmins.onSave: ERROR: ${utils.errorMessage(err)}`);
					});
					return p;
				}
			});
	}

	isPasswordOk(state) {
		// console.log(`isPasswordOk: ${state.password1} === ${state.password2} = ${state.password1===state.password2}`);
		// console.log(`isPasswordOk: length: ${state.password1.length} and ${state.password2.length}`);
		const passwordsMatch = state.password1 === state.password2;
		return state.admin.id
			? (passwordsMatch && (state.password1.length > 5 || state.password1.length === 0))
			: passwordsMatch && (state.password1.length > 5);
	}

	render() {
		const {admin = {permissions: 'A'}} = this.state;

		/// Email error indicator
		const hasValidEmail = utils.validEmail(admin.email);
		const emailBackgroundColor = (hasValidEmail ? 'white' : 'red');

		/// Password error indicator
		const passwordsOk = this.isPasswordOk(this.state);
		const passwordBackgroundColor = (passwordsOk ? 'white' : 'red');

		const messageComponent = this.state.message ? <Text style={styles.error}>{this.state.message}</Text> : null;

		//console.log(`EditAdmin.render(): emailBackgroundColor: ${emailBackgroundColor} `);
		//console.log(`EditAdmin.render(): passwordBackgroundColor: ${passwordBackgroundColor} `);
		return <View style={styles.container}>
			<Text style={{color: 'white'}}>{admin.id ? 'Edit' : 'Add'} Administrator</Text>
			{messageComponent}
			<View style={styles.form}>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>First Name</Text>
					</View>
					<View style={styles.formInput}>
						<AutoGrowingTextInput
							style={[styles.formInput, {borderWidth: 1}]}
							value={admin.firstName}
							onChangeText={this.update.bind(this, 'firstName')}/>
					</View>
				</View>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Last Name</Text>
					</View>
					<View style={styles.formInput}>
						<AutoGrowingTextInput
							style={[styles.formInput, {borderWidth: 1}]}
							value={admin.lastName}
							onChangeText={this.update.bind(this, 'lastName')}/>
					</View>
				</View>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Email</Text>
					</View>
					<View style={styles.formInput}>
						<AutoGrowingTextInput
							style={[styles.formInput, {borderWidth: 1, width: '100%'}]}
							value={admin.email}
							onChangeText={this.update.bind(this, 'email')}/>
					</View>
				</View>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Password</Text>
					</View>
					<View style={styles.formInput}>
						<PasswordInput onChangeText={this.updatePassword1.bind(this)}/>
					</View>
				</View>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Retype Password</Text>
					</View>
					<View style={styles.formInput}>
						<PasswordInput onChangeText={this.updatePassword2.bind(this)}/>
					</View>
				</View>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Manage Admins</Text>
					</View>
					<View style={styles.formInput}>
						<Switch
							onValueChange={this.updateManageAdmins.bind(this)}
							value={admin.permissions.includes('M')}
						/>
					</View>

				</View>
				<View>
					<Button
						color={'#003459'}
						disabled={!(hasValidEmail && passwordsOk)}
						title={'Save'}
						raised={true}
						onPress={() => this.onSave(this.state.admin)}/>
				</View>
			</View>

		</View>
	}
}

export default withNavigation(EditAdmin);
