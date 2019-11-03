// EditAdmin.js
import React from 'react'
import {
    View,
    Text,
    Button, TextInput,
    StyleSheet, Switch,
    AsyncStorage
} from 'react-native'
import {SocialIcon, CheckBox} from 'react-native-elements';
import {Col, Row, Grid} from "react-native-easy-grid";
import Users from '../../services/users';
//import TextInput from "react-native-web/src/exports/TextInput";
import InputPassword from 'react-native-elements-input-password';
import sha256 from 'js-sha256';

function remove_character(str_to_remove, str) {
    let reg = new RegExp(str_to_remove)
    return str.replace(reg, '')
}

export default class EditAdmin extends React.Component {

    constructor(props) {
        super(props);
        const {navigation: {state: {params: {admin}}}} = props;
        console.log(`EditAdmin(${JSON.stringify(admin)})`);
        this.state = {admin, password1:'', password2:''};
    }

    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Edit Administrator Info'
                },
            }
        };
    }

    updateEmail(email) {
        console.log(`updateEmail: email:${email}`);
        const admin = {...this.state.admin, email};
        this.setState((prevState) => ({...prevState, admin}));
    }

    updateManageAdmins(canManage) {
        console.log(`updateManageAdmins: canManage:${canManage}`);
        this.setState((prevState) => {
            const {admin} = prevState;
            const permissions = (canManage && !admin.permissions.includes('M')) ? admin.permissions + 'M'
                : (admin.permissions.includes('M') ? remove_character('M', admin.permissions) : admin.permissions);
            console.log(`updateManageAdmins: admin.permissions: ${permissions}`);
            const newAdmin = {...this.state.admin, permissions};
            return {...prevState, admin: newAdmin};
        });
    }

    updateFirstName(firstName) {
        const admin = {...this.state.admin, firstName};
        this.setState((prevState) => ({...prevState, admin}));
    }

    updateLastName(lastName) {
        const admin = {...this.state.admin, lastName};
        this.setState((prevState) => ({...prevState, admin}));
    }

    updatePassword1(password) {
        console.log(`updatePassword1: ${password}`);
        this.setState((prevState) => ({...prevState, password1: password}));
    }

    updatePassword2(password) {
        console.log(`updatePassword2: ${password}`);
        this.setState((prevState) => ({...prevState, password2: password}));
    }

    passwordHash(password){
        var hash = sha256.create();
        hash.update(password);
        return hash.hex();
    }
    async onSave(admin) {
        let newAdmin;
        let newPswd;
        if (this.state.password1.length > 0){
            var hash = this.passwordHash(this.state.password1);
            newPswd = this.state.password1;
             newAdmin = {...this.state.admin, passwordHash: hash};
        }else{
            newAdmin = {...this.state.admin, passwordHash: null};
        }
        this.setState((prevState) => ({...prevState, admin: newAdmin}));
        /// Use Users service to save the admin
        console.log(`Saving admin: ${newPswd? 'pass: '+ newPswd : ''} ${JSON.stringify(newAdmin)}`);
        await Users.updateAdmin(newAdmin);
    }

    validEmail(email) {
        function hasWhiteSpace(s) {
            return /\s/g.test(s);
        }

        return email.includes('@') && !hasWhiteSpace(email);
    }

    render() {
        const {admin} = this.state;

        /// Email error indicator
        const hasValidEmail = this.validEmail(admin.email);
        const emailBackgroundColor = (hasValidEmail ? 'white' : 'red');

        /// Password error indicator
        const passwordsMatch = this.state.password1 === this.state.password2;
        const passwordsOk = passwordsMatch && (this.state.password1.length == 0 || this.state.password1.length > 5);
        const passwordBackgroundColor = (passwordsOk ? 'white' : 'red');

        console.log(`render(): emailBackgroundColor: ${emailBackgroundColor} `);
        console.log(`render(): passwordBackgroundColor: ${passwordBackgroundColor} `);
        return <View style={styles.container}>
            <Text style={{color: 'white'}}>{admin.id ? 'Edit' : 'Add'} Administrator</Text>
            <View style={styles.form}>
                <View style={styles.formRow}>
                    <View style={styles.formLabel}>
                        <Text>First Name</Text>
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.formInput}>
                            <TextInput
                                value={admin.firstName}
                                onChangeText={this.updateFirstName.bind(this)}/>
                        </Text>
                    </View>
                </View>
                <View style={styles.formRow}>
                    <View style={styles.formLabel}>
                        <Text>Last Name</Text>
                    </View>
                    <View style={styles.formInput}>
                        <Text style={styles.formInput}>
                            <TextInput
                                value={admin.lastName}
                                onChangeText={this.updateLastName.bind(this)}/>
                        </Text>
                    </View>
                </View>
                <View style={styles.formRow}>
                    <View style={styles.formLabel}>
                        <Text>Email</Text>
                    </View>
                    <View style={styles.formInput}>
                        <Text style={{...styles.formEmailInput, color: 'white', backgroundColor: emailBackgroundColor}}>
                            <TextInput
                                style={{...styles.formInput,}}
                                value={admin.email}
                                onChangeText={this.updateEmail.bind(this)}/>
                        </Text>
                    </View>
                </View>
                <View style={styles.formRow}>
                    <View style={styles.formLabel}>
                        <Text>Password</Text>
                    </View>
                    <View style={styles.formInput}>
                        <Text style={{...styles.formInput, backgroundColor: passwordBackgroundColor}}>
                            <TextInput
                                secureTextEntry={true}
                                style={{...styles.formInput,}}
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
                                style={{...styles.formInput}}
                                onChangeText={this.updatePassword2.bind(this)}
                            /></Text>
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
                        disabled={!(hasValidEmail && passwordsOk)}
                        title={'Save'}
                        raised={true}
                        onPress={() => this.onSave(this.state.admin)}/>
                </View>
            </View>

        </View>
    }
}
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