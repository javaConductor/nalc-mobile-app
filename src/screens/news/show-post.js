// ShowPost.js
import React from 'react';
import {ActivityIndicator, Linking, Text, View} from 'react-native'
import HTML from 'react-native-render-html';
import styles from '../../screens/main-styles';
import * as Font from 'expo-font';


class ShowPost extends React.Component {

	constructor(props) {
		super(props);
		if (!props.post) {
			throw {errorMessage: 'ShowPost: Error "post" prop not set or null.'}
		}
		this.state = {
			post: props.post,
			loading: true
		};
	}

	async componentDidMount() {
		await Font.loadAsync({
			'Oswald-Bold': require('../../../assets/fonts/Oswald-Bold.ttf'),
			'OswaldHeavy-Regular': require('../../../assets/fonts/OswaldHeavy-Regular.ttf'),

		});
		this.setState((prevState) => {
			return {...prevState, loading: false}
		})
	}

	render() {
		const {post, loading} = this.state;

		if (loading)
			return <ActivityIndicator size={'large'}/>;

		console.log(`ShowPost: post: ${post.title}`);
		const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
		const dateStr = new Date(post.date).toLocaleString("en-US", options);
		return <View style={{...styles.post}} key={post.id}>
			<Text>{dateStr}</Text>
			<Text style={{...styles.postTitle, fontSize: 20, fontFamily: 'OswaldHeavy-Regular'}}>{post.title}</Text>
			<View style={styles.postContent}>
				<HTML html={post.content}
				      onLinkPress={(evt, href) => {
					      Linking.openURL(href);
				      }}/>
			</View>
			<View
				style={{
					borderBottomColor: '#222222',
					borderBottomWidth: 3,
				}}
			/>
		</View>
	}

}

export default ShowPost;
