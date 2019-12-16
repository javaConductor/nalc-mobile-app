export const evaluateOuterDrawerListItems = items => {
	const drawerItems = {};
	items.forEach((item, index) => {
		let {key} = item;
//		console.log(`OuterDrawerListItem: ${key}.`);

		// Delimiter _
		// key => DataSearch_Basic to DataSearch
		const origKey = key;
		key = key.substr(0, key.indexOf('_'));
		if (key.length) {
			if (drawerItems.hasOwnProperty(key)) {
				const opt = origKey.substr(origKey.indexOf('_') + 1);

				//console.log(`OuterDrawerListItem.Group: ${key} Item: ${opt} start: ${drawerItems[key].start} end: ${index+1}`);
				drawerItems[key].end = index + 1;
			} else {
				//console.log(`OuterDrawerListItem.Group: ${key} start: ${index} end: ${0}`);
				drawerItems[key] = {
					start: index,
					end: 0,
				};
			}
		} else {
			//console.log(`OuterDrawerListItem.Group: ${origKey} NO Children start: ${index} end: ${index+1}`);
			drawerItems[origKey] = {
				start: index,
				end: index + 1,
			};

		}
	});
	console.log(`OuterDrawerListItem: return: ${JSON.stringify(drawerItems, null, 2)}`);
	return drawerItems;
};

export const evaluateChildDrawerTitle = ({navigation}) => ({
	title: navigation.state.key.substr(navigation.state.key.indexOf('_') + 1),
});
