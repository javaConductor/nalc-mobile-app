import {TextInput} from "react-native";
import React from "react";
import styles from "../screens/main-styles";


export default class PasswordInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			onChangeText: props.onChangeText
		};
	}

	render() {
		// console.log(`PasswordInput.render: backgroundColor: ${backgroundColor}  isRed: ${backgroundColor === 'red'}`);
		return <TextInput
			secureTextEntry={true}
			style={{
				...styles.formInput,
				borderWidth: 1,
				width: '100%',
				backgroundColor: this.props.backgroundcolor
			}}
			onChangeText={this.props.onChangeText}
		/>

	}
}
