// ManageAdmins.js
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
import { withNavigation } from 'react-navigation';

function remove_character(str_to_remove, str) {
    let reg = new RegExp(str_to_remove)
    return str.replace(reg, '')
}
const STATUS_SUSPENDED = "Suspended";
const STATUS_ACTIVE = "Active";

class ManageAdmins extends React.Component {

    constructor(props){
        console.log(`ManageAdmins: props: ${JSON.stringify(props)}`);
        super(props);
    }

    state = {
        admins: undefined,
        isLoading: true,
        errorLoading: false
    };

    static get options() {
        return {
            topBar: {
                title: {
                    text: 'Manage Admins'
                },
            }
        };
    }

    async componentWillMount() {
        console.log("ManageAdmins: componentWillMount");
        try {
            // this.setState({admins: fakeData, isLoading: false});
            // console.log(`ManageAdmins: componentWillMount: fakeData: ${JSON.stringify(fakeData)}`);

            /// uncomment this after tests
            const admins = await Users.getAdmins();
            this.setState({admins, isLoading: false});
        } catch (e) {
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
        console.log(`ManageAdmins.render: props: ${JSON.stringify(this.props)}`);

        const {admins, isLoading, errLoading, error} = this.state;

        if (errLoading)
            return this.renderError(e);
        if (isLoading)
            return this.renderLoading();
        const {navigate} = this.props.navigation;

        const adminList = admins.map((admin) => this.renderAdmin(admin, this.props));
        const msgCtrl = this.state.message ? <Text>{this.state.message}</Text> : "";
        return <View style={styles.container}>
            <View style={styles.adminRow}>
                <View style={styles.adminName}>
                    <Text>Admin Name</Text>
                </View>
                <View style={styles.adminActions}>
                    <Text>Actions</Text>
                </View>
            </View>
            <Button title={"New Admin"}  onPress={() => {navigate('EditAdmin', {})}} />
            {adminList}
        </View>
    }

    onSuspendAdmin(admin) {
        const {navigate} = this.props.navigation;
        /// Set it to status ='Suspended'
    }
    async onRemoveAdmin(admin) {
        const {navigate} = this.props.navigation;
        await Users.removeAdmin(admin.id);
        const newList = this.state.admins.filter((adm) => {adm.id !== admin.id});
        this.setState((prevState,props) => {  return {...prevState, admins: newList} } );
    }

    renderAdmin(admin, props) {
        console.log(`ManageAdmins.renderAdmin: props: ${JSON.stringify(props)}`);
        console.log(`ManageAdmins.renderAdmin: state: ${JSON.stringify(this.state)}`);

        console.log(`renderAdmin(${JSON.stringify(admin)})`);
        const {navigate} = props.navigation;

        const {id, firstName, lastName, permissions} = admin;
        return (
            <View key={admin.id} style={styles.adminRow}>
                <View style={styles.adminName}>
                    <Button title={`${firstName} ${lastName}` } onPress={() => {navigate('EditAdmin', {admin})}} />
                </View>
                <View style={styles.adminActions}>
                    <Button title={'Suspend'} onPress={() => this.onSuspendAdmin(admin)} />
                    <Button title={'Remove'} onPress={() => this.onRemoveAdmin(admin)} />
                </View>
            </View>);
    }
}

export default withNavigation(ManageAdmins);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    adminRow: {
        flex: 1,
        flexDirection: 'row'
    },
    adminName: {
        flex: 1,
        flexDirection: 'row',
        width: '80%'
    },
    adminActions: {
        flex: 1,
        width: '20%',
        flexDirection: 'row'
    }
});