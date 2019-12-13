import {StyleSheet} from "react-native";
import Constants from 'expo-constants';


const styles = StyleSheet.create({
	container: {
		marginTop: Constants.statusBarHeight,
		flex: 1,
		justifyContent: 'space-around',
		//alignItems: 'center',
		backgroundColor: 'white',
		width: '100%',
		height: '100%'

	},
	button: {
		color: 'navy',
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
		// borderWidth: 1,
		flexGrow: 1,
		backgroundColor: 'white',
		width: '100%'
	},
	formInputSwitch: {
		flex: 1,
		alignSelf: 'center',
		//flexDirection: 'col',
		// color: 'navy',
		borderColor: 'navy',
		// borderWidth: 1,
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
		// color: 'white'
	},
	formPassword: {
		//flexDirection: 'col',
		backgroundColor: 'navy',
		// color: 'white',
		// width: '50%'
	},
	message: {
		//flexDirection: 'col',
		backgroundColor: 'yellow',
		color: 'navy',
		// color: 'white',
		// width: '50%'
	},
	error: {
		//flexDirection: 'col',
		backgroundColor: 'red',
		// color: 'white',
		// width: '50%'
	},
	logo: {
		flexGrow: 1,
		justifyContent: 'center',
		// alignSelf: 'flex-end',
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
		zIndex: 0
	},
	homeLabel: {
		width: '100%',
		marginBottom: 10,
		backgroundColor: 'navy',
		color: 'white',
		fontSize: 20,
		fontWeight: '900',
		alignSelf: 'flex-start'
	},
	post: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 5,
	},
	postTitle: {
		color: 'maroon',
		fontFamily: 'Oswald-Bold',
		fontStyle: "normal",
		fontSize: 30,
		backgroundColor: 'white',
		marginLeft: 10,
		marginRight: 20,
		alignSelf: 'center'
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
		backgroundColor: 'navy',
		color: 'white',
		fontSize: 20,
		fontWeight: '900',
		alignSelf: 'flex-start'
	}
});
export default styles;