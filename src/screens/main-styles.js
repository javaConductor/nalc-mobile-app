import {StyleSheet} from "react-native";
import Constants from 'expo-constants';


const menuHeight = 0;
const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		marginLeft: 0,
		marginRight: 0,
		flex: 1,
		justifyContent: 'space-around',
		//alignItems: 'center',
		backgroundColor: '#e0eaf6',
		width: '100%',
		height: '100%'

	},
	button: {
		color: '#003459',
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
		borderColor: 'navy',
		flexGrow: 1,
		backgroundColor: 'white',
		width: '100%'
	},
	formInputSwitch: {
		flex: 1,
		alignSelf: 'center',
		borderColor: 'navy',
		flexGrow: 1,
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
	},
	formPassword: {
		backgroundColor: 'navy',
	},
	message: {
		backgroundColor: 'yellow',
		color: 'navy',
	},
	error: {
		backgroundColor: 'red',
	},
	logo: {
		flexGrow: 1,
		justifyContent: 'center',
		width: 300,
		height: 400,
		overflow: 'visible',
		resizeMode: "contain",
		zIndex: 0
	},
	logoContainer: {
		flex: 2,
		justifyContent: 'flex-start',
		alignItems: 'stretch',
	},
	homeLabel: {
		width: '100%',
		marginBottom: 10,
		backgroundColor: '#003459',
		color: 'white',
		fontSize: 20,
		fontWeight: '900',
		alignSelf: 'flex-start',
		paddingTop: 10,
		paddingBottom: 10,
	},
	post: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 5,
	},
	postTitle: {
		color: '#003459',
		fontFamily: 'Oswald-Bold',
		fontStyle: "normal",
		fontSize: 30,
		backgroundColor: '#e0eaf6',
		marginLeft: 10,
		marginRight: 20,
		alignSelf: 'flex-start'
	},
	postContent: {
		backgroundColor: 'white',
		marginLeft: 5,
		marginRight: 5,
	},
	rowCol: {
		borderWidth: 1,
		borderColor: 'black'
	},

	rowHeader: {
		fontWeight: 'bold',
		alignSelf: 'center',
		fontSize: 20,
	},
	screenTitle: {
		width: '100%',
		backgroundColor: '#003459',
		color: 'white',
		fontSize: 20,
		fontWeight: '900',
		alignSelf: 'center',
	},
	menuIcon: {
		zIndex: 9,
		position: 'absolute',
		top: 0,
		right: 0,

	}
});
export default styles;
