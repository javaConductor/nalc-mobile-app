import React from "react";
import {Ionicons} from '@expo/vector-icons';
import styles from "../../screens/main-styles";


export default class MenuButton extends React.Component {

	render() {
		return (
			<Ionicons name={'md-menu'} color={'white'}
			          size={32}
			          style={styles.menuIcon}
			          onPress={() => {
				          this.props.navigation.toggleDrawer()
			          }}
			/>
		)
	}
}