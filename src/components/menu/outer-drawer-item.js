import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';


const OuterDrawerItem = (item) => {
	const {label, onPress, hasChildren} = item;
	console.log(`OuterDrawerItem ${JSON.stringify(item, null, 2)}`);
	return <TouchableOpacity
		onPress={onPress}
		style={{
			paddingTop: 21,
			paddingBottom: 16,
			paddingLeft: 15,
			paddingRight: 10,
		}}
	>
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
			}}
		>
			<Text>{label}</Text>
			{hasChildren ? <Icon name="chevron-right" size={20}/> : null}
		</View>
	</TouchableOpacity>
};

export default OuterDrawerItem;
