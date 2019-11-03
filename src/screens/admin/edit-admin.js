// EditAdmin.js
import React from 'react'
import {
    View,
    Text,
    Button,
    StyleSheet, Switch,
    AsyncStorage
} from 'react-native'
import {SocialIcon, CheckBox} from 'react-native-elements';
import {Col, Row, Grid} from "react-native-easy-grid";
import Users from '../../services/users';
import TextInput from "react-native-web/src/exports/TextInput";

 function remove_character(str_to_remove, str) {
    let reg = new RegExp(str_to_remove)
    return str.replace(reg, '')
}

export default class EditAdmin extends React.Component {

    constructor(props){
        super(props);
        const {navigation:{state:{params:{admin}}}} = props;
        console.log(`EditAdmin(${JSON.stringify( admin)})`);
        this.state = { admin };
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

    updateEmail(email){
        console.log(`updateEmail: email:${email}`);
        const admin = {...this.state.admin, email};
        this.setState((prevState) => ({ ...prevState, admin })  );
    }

    updateManageAdmins(canManage){
        console.log(`updateManageAdmins: canManage:${canManage}`);
        this.setState((prevState) => {
            const {admin} = prevState;
            const permissions = (canManage && !admin.permissions.includes('M')) ? admin.permissions + 'M'
                :  ( admin.permissions.includes('M') ? remove_character('M', admin.permissions) : admin.permissions );
            console.log(`updateManageAdmins: admin.permissions: ${permissions}`);
            const newAdmin = {...this.state.admin, permissions};
            return { ...prevState, admin : newAdmin};
        });

    }

    // updateEmail(firstName){
    //     const admin = {...this.state.admin, firstName};
    //     this.setState((prevState) => ({ ...prevState, admin})  );
    // }
    //
    // updateEmail(firstName){
    //     const admin = {...this.state.admin, firstName};
    //     this.setState((prevState) => ({ ...prevState, admin})  );
    // }


    onSave(admin){

        console.log(`Saving admin: ${JSON.stringify(admin)}`);
    }

    render() {
        const {admin} = this.state;

        return <View style={styles.container}>
            <Text>{admin.id ? 'Edit' : 'Add'} Administrator</Text>
            <View style={styles.form}>
                <View style={styles.formRow}>
                    <View  style={styles.formLabel}>
                        <Text>First Name</Text>
                    </View>
                    <View>
                        <Text style={styles.formInput}>
                        <TextInput value={admin.firstName} />
                        </Text>
                    </View>
                </View>
                <View style={styles.formRow}>
                    <View  style={styles.formLabel}>
                        <Text>Last Name</Text>
                    </View>
                    <View>
                        <Text style={styles.formInput}>
                            <TextInput value={admin.lastName}/></Text>
                    </View>
                </View>
                <View style={styles.formRow}>
                    <View  style={styles.formLabel}>
                        <Text>Email</Text>
                    </View>
                    <View>
                        <Text style={styles.formInput}>
                        <TextInput  value={admin.email}  onChangeText={ this.updateEmail.bind(this)} />
                        </Text>
                    </View>
                </View>
                <View style={styles.formRow}>
                    <View  style={styles.formLabel}>
                        <Text>Password</Text>
                    </View>
                    <View>
                        <TextInput style={styles.formInput} />
                    </View>
                </View>
                <View style={styles.formRow}>
                    <View style={styles.formLabel}>
                        <Text>Retype Password</Text>
                    </View>
                    <View>
                        <TextInput style={styles.formInput} />
                    </View>
                </View>
                <View style={styles.formRow}>
                    <View style={styles.formLabel}>
                        <Text>Manage Admins</Text>
                    </View>
                    <View style={styles.formInput} >
                        <Switch
                            onValueChange={ this.updateManageAdmins.bind(this) }
                            value={admin.permissions.includes('M')}
                        />
                    </View>

                </View>
                <View>
                    <Button title={'Save'} onPress={ () => this.onSave(this.state.admin)} />
                </View>
            </View>

        </View>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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
        width: '50%'
    },
    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
        // color: 'white'
    },
    forPassword: {
        //flexDirection: 'col',
        backgroundColor: 'navy',
        autoCompleteType: 'password',
        secureTextEntry: true,

        // color: 'white',
        // width: '50%'
    },
});