// Login.js
import React from 'react'
import {Button, Text, TextInput, View} from 'react-native'
import util from '../services/util';
import auth from '../services/auth';
import styles from './main-styles';
import {NavigationEvents} from "react-navigation";


class Login extends React.Component {
	static navigationOptions = {
		title: 'Login',
		headerLeft: null
	};

	constructor(props) {
		super(props);
		this.state = {
			message: undefined,
			auth: {
				email: undefined,
				password: undefined
			},
		};
		/// store the actual target in the state
		if (this.props.navigation.state.params?.target) {

			this.state.targetInfo = {
				target: this.props.navigation.state.params.target,
				targetData: this.props.navigation.state.params.targetData || {}
			};
			console.log(`login with target: ${JSON.stringify(this.state.targetInfo)}`);
		}
	}

	updateEmail(email) {
		//console.log(`updateEmail: email:${email}`);
		const auth = {...this.state.auth, email};
		this.setState((prevState) => ({...prevState, auth}));
	}

	updatePassword(password) {
		//console.log(`updatePassword: password:${password}`);
		const auth = {...this.state.auth, password};
		this.setState((prevState) => ({...prevState, auth}));
	}

	async componentDidMount() {
		const {navigate} = this.props.navigation;

		const authenticated = await auth.isUserAuthenticated();
		console.log(`Login.componentDidMount: isAuthenticated: ${authenticated}`);

		if (authenticated) {
			return navigate("UploadArticle", {});
		}

		console.log(`Login.componentDidMount: auth: ${JSON.stringify(this.state.auth, null, 2)}`);
		this.setState((prevState) => ({...prevState, auth: {email: "", password: ""}}));
	}

	async onLogin() {
		/// Hash password
		const passwordHash = util.passwordHash(this.state.auth.password);
		const authInfo = await auth.authenticate(this.state.auth.email, passwordHash)
			.catch((err) => {
				console.log(`Login.onLogin: authenticate error: ${JSON.stringify(err, null, 2)}`);
				this.setState((prevState) => {
					return {...prevState, errorMessage: `${util.errorMessage(err)}`}
				});
				//throw err;
			});

		//console.log(`Login.onLogin: authInfo: ${JSON.stringify(authInfo, null, 2)}`);

		if (authInfo && authInfo.authenticated) {
			const {navigate} = this.props.navigation;
			this.setState((prevState) => {
				return {...prevState, auth: {email: "", password: ""}}
			});

			if (this.state.targetInfo) {
				const {target, targetData} = this.state.targetInfo;
				navigate(target, targetData);
			} else navigate('Admin', {});
		} else {
			if (authInfo)
				this.setState((prevState) => {
					return {...prevState, message: authInfo.message}
				});
			else
				this.setState((prevState) => {
					return {...prevState, message: "Not authenticated!!"}
				})
		}
	}

	render() {
		const {email, password} = this.state.auth;
		console.log(`Login.render: auth: ${JSON.stringify({email, password})}`);
		const {message, errorMessage} = this.state;
		const hasError = !!errorMessage;
		const displayMessage = hasError ? errorMessage : message;
		const messageStyle = hasError ? styles.error : styles.message;
		const canLogin = email && email.trim().length > 0 && password && password.trim().length > 0;
		const msgComponent = this.state.message ? <Text style={messageStyle}>{displayMessage}</Text> : null;
		return (
			<View style={styles.container}>
				<NavigationEvents
					onDidBlur={this.componentDidMount.bind(this)}
					onWillFocus={this.componentDidMount.bind(this)}/>
				{msgComponent}
				<View style={styles.form}>
					<View style={styles.formRow}>
						<View style={styles.formLabel}>
							<Text>EMAIL</Text>
						</View>
						<View style={styles.formInput}>
							<Text style={styles.formInput}>
								<TextInput
									value={email}
									onChangeText={this.updateEmail.bind(this)}/>
							</Text>
						</View>
					</View>
					<View style={styles.formRow}>
						<View style={styles.formLabel}>
							<Text>PASSWORD</Text>
						</View>
						<View style={styles.formInput}>
							<Text style={styles.formInput}>
								<TextInput
									secureTextEntry={true}
									style={{...styles.formInput,}}
									onChangeText={this.updatePassword.bind(this)}/>
							</Text>

						</View>
					</View>

					<Button
						disabled={!canLogin}
						onPress={this.onLogin.bind(this)}
						title="Login"
					/>
				</View>
			</View>
		)
	}
}

export default Login;
