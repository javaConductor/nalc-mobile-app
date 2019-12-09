import {StyleSheet} from "react-native";


const styles = StyleSheet.create({
	container: {
		flex: 2,
		justifyContent: 'space-around',
		//alignItems: 'center',
		backgroundColor: 'white',
		width: '100%',
		height: '100%'

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
		backgroundColor: 'lightYellow',
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
		backgroundColor: 'navy',
		color: 'white',
		fontSize: 20,
		fontWeight: '1000',
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
		fontStyle: "bold",
		fontSize: 30,
		backgroundColor: 'white',
		marginLeft: 10,
		marginRight: 20,
		alignSelf: 'center'
	},
	postContent: {
		color: 'navy',
		backgroundColor: 'white',
		marginLeft: 5,
		marginRight: 5,
	},
	rowHeader: {
		fontWeight: 'bold',
		alignSelf: 'center',
	},
});
export default styles;