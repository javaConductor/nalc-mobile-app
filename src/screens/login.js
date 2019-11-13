// Login.js
import React from 'react'
import {
    View,
    Text,
    Button,
    StyleSheet,
    AsyncStorage
} from 'react-native'
import Anchor from '../components/anchor';
import {withNavigation} from "react-navigation";
import TextInput from "react-native-web/dist/exports/TextInput";
import sha256 from 'js-sha256';
import util from '../services/util';
import auth from '../services/auth';

//import { USER_KEY } from '../config';

class Login extends React.Component {

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
        if (this.props.navigation.state.params.target){

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

    async onLogin(){
        /// Hash password
        const passwordHash = util.passwordHash(this.state.auth.password);
        const authInfo  = await auth.authenticate(this.state.auth.email, passwordHash)
            .catch((err) => {
                this.setState((prevState) => { return { ...prevState, message: err}})
            });
        if( authInfo && authInfo.authenticated ) {
            const {navigate} = this.props.navigation;
            if (this.state.targetInfo){
             const {target, targetData} = this.state.targetInfo;
                navigate(target, targetData);
            } else navigate('Admin', {});
        }
        else{
            if (authInfo)
                this.setState((prevState) => { return { ...prevState, message: authInfo.message}});
            else
                this.setState((prevState) => { return { ...prevState, message: "Not authenticated!!"}})

        }
    }

    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Login'
                },
            }
        };
    }

    render() {
        const {email, password} = this.state.auth;
        const msgComponent = this.state.message ? <Text style={styles.errorText}>{this.state.message}</Text> : null;
        return (
            <View style={styles.container}>
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
                            <Text style={ styles.formInput }>
                                <TextInput
                                    secureTextEntry={true}
                                    style={{...styles.formInput,}}
                                    onChangeText={this.updatePassword.bind(this)}/>
                            </Text>

                        </View>
                    </View>

                    <Button
                        onPress={ this.onLogin.bind(this) }
                        title="Login"
                    />


                </View>
            </View>
        )
    }
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        backgroundColor: 'navy',
        width: '100%'

    },
    form: {
        flex: 1,
        flexDirection: 'column',
        //backgroundColor: 'navy',
        // color: 'white'
    },
    formLabel: {// View
        flex: 1,
        //flexDirection: 'col',

        backgroundColor: 'white',
        // color: 'white',
        width: '50%'
    },
    formValue: {//View
        flex: 1,
        //flexDirection: 'col',
        // color: 'navy',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: 'navy',
        backgroundColor: 'white',
        width: '50%'
    },
    formName: {
        //flexDirection: 'col',
        backgroundColor: 'navy',
        // color: 'white',
        // width: '50%'
    },
    formInput: {
        flex: 1,
        //flexDirection: 'col',
        // color: 'navy',
        borderColor: 'navy',
        borderWidth: 1,

        backgroundColor: 'white',
        width: '100%'
    },
    formEmailInput: {
        flex: 1,
        borderWidth: 1,
        backgroundColor: 'white',
        width: '100%'
    },
    formRow: {
        margin: 2,
        flexDirection: 'row',
        justifyContent: 'space-between'
        // color: 'white'
    },
    formPassword: {
        //flexDirection: 'col',
        backgroundColor: 'navy',
        // color: 'white',
        // width: '50%'
    },
});