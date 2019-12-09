// ChangePassword.js
import React from 'react'
import {Button, Text, TextInput, View} from 'react-native'
import Users from '../../services/users';
import styles from '../../screens/main-styles';
import utils from '../../services/util';
import auth from '../../services/auth';
import {NavigationEvents} from "react-navigation";


export default class ChangePassword extends React.Component {
	static navigationOptions = {
		title: 'Change Password',
	};

	constructor(props) {
		super(props);
		this.state = {password1: '', password2: ''};
		console.log(`ChangePassword.componentDidMount: routes: ${utils.getAvailableRoutes(this.props.navigation)}`);

	}

	async componentDidMount() {
		const currentUser = await auth.currentUser();
		return this.setState((prevState) => ({...prevState, userId: currentUser.id, password1: '', password2: ''}));
	}

	componentWillUnmount() {
		return this.setState((prevState) => ({...prevState, password1: '', password2: ''}));
	}

	updatePassword1(password) {
		//console.log(`updatePassword1: ${password}`);
		this.setState((prevState) => ({...prevState, password1: password}));
	}

	updatePassword2(password) {
		//console.log(`updatePassword2: ${password}`);
		this.setState((prevState) => ({...prevState, password2: password}));
	}

	async onSave() {
		const hash = utils.passwordHash(this.state.password1);
		const newAdmin = {id: this.state.userId, passwordHash: hash};
		return Users.updateAdmin(newAdmin)
			.catch((err) => {
				console.error(`ChangePassword.onSave: ERROR: ${utils.errorMessage(err)}`);
				const message = `Error changing password: ${err}`;
				this.setState((prevState) => ({...prevState, message, password1: '', password2: ''}));
			})
			.then(() => {
				//this.props.navigation.goBack().goBack();
				this.setState((prevState) => ({...prevState, password1: '', password2: ''}));
				this.props.navigation.navigate('Admin', {});
			});
	}

	isPasswordOk(state) {
		// console.log(`isPasswordOk: ${state.password1} === ${state.password2} = ${state.password1===state.password2}`);
		const passwordsMatch = state.password1 === state.password2;
		const passwordsOk = (passwordsMatch && (state.password1.length > 5));
		console.log(`isPasswordOk: length: ${state.password1.length} and ${state.password2.length} OK: ${passwordsOk}`);
		return passwordsOk;
	}

	render() {
		console.log(`ChangePassword.render: ${JSON.stringify(this.state)}`);
		/// Password error indicator
		const passwordsOk = this.isPasswordOk(this.state);
		const passwordBackgroundColor = (passwordsOk ? 'white' : 'red');
		const errorComponent = this.state.errorMessage ?
			<Text style={styles.error}>{this.state.errorMessage}</Text> : null;
		const messageComponent = this.state.message ? <Text style={styles.message}>{this.state.message}</Text> : null;

		console.log(`ChangePassword.render: passwordBackgroundColor: ${passwordBackgroundColor} `);
		return <View style={styles.container}>
			<NavigationEvents
				onWillBlur={this.componentWillUnmount.bind(this)}
				onWillFocus={this.componentDidMount.bind(this)}/>
			<Text style={{color: 'white'}}>Change Password</Text>
			{errorComponent}
			{messageComponent}
			<View style={styles.form}>
				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Password</Text>
					</View>
					<View style={styles.formInput}>
						<Text style={{...styles.formInput, backgroundColor: passwordBackgroundColor}}>
							<TextInput
								secureTextEntry={true}
								style={{...styles.formInput, backgroundColor: passwordBackgroundColor}}
								onChangeText={this.updatePassword1.bind(this)}/>
						</Text>
					</View>
				</View>

				<View style={styles.formRow}>
					<View style={styles.formLabel}>
						<Text>Retype Password</Text>
					</View>
					<View style={styles.formInput}>
						<Text style={{...styles.formInput, backgroundColor: passwordBackgroundColor}}>
							<TextInput
								secureTextEntry={true}
								style={{...styles.formInput, backgroundColor: passwordBackgroundColor}}
								onChangeText={this.updatePassword2.bind(this)}
							/>
						</Text>
					</View>
				</View>

				<View>
					<Button
						color={'navy'}
						disabled={!(passwordsOk)}
						title={'Change Password'}
						raised={true}
						onPress={this.onSave.bind(this)}/>
				</View>
			</View>
		</View>
	}
}
