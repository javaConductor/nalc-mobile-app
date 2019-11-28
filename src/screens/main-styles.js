import {StyleSheet} from "react-native";


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
	message: {
		//flexDirection: 'col',
		backgroundColor: 'lightYellow',
		// color: 'white',
		// width: '50%'
	}, error: {
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
		justifyContent: 'center',
		alignItems: 'stretch',


		// width: 300,
		// height: 400,
		// width: 300,
		// height: 400,
		zIndex: 0
	},
});
export default styles;