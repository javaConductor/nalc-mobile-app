import React from 'react';
import {Image, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import smallLogo from '../../../assets/logoSm.png';


const DrawerHeader = ({navigateToCallback}) => (
	<TouchableOpacity onPress={() => navigateToCallback('Home')}>
		<View
			style={{
				flexDirection: 'row',
				backgroundColor: '#003459',
				paddingVertical: 28,
				paddingLeft: 17,
				paddingTop: StatusBar.currentHeight + 10,
				alignItems: 'center',
			}}
		>
			<Image source={smallLogo}/>
			<Text style={{color: '#FFF', paddingLeft: 9, fontSize: 16, backgroundColor: '#003459'}}>
				NALC Mobile
			</Text>
		</View>
	</TouchableOpacity>
);

export default DrawerHeader;
