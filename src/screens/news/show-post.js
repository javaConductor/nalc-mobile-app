// ShowPost.js
import React, {useState} from 'react';
import {Linking, Text, View} from 'react-native'
import HTML from 'react-native-render-html';
import styles from '../../screens/main-styles';
import util from '../../services/util';


const ShowPost = (props) => {
	const [post, setPost] = useState(props.post);

	if (!post) {
		throw {errorMessage: 'ShowPost: Error "post" prop not set or null.'}
	}
	try {
		console.log(`ShowPost: post: ${post.title}`);
		const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
		const dateStr = new Date(post.date).toLocaleString("en-US", options);
		return <View style={{...styles.post}} key={post.id}>
			<Text>{dateStr}</Text>
			<Text style={styles.postTitle}>{post.title}</Text>
			<Text style={styles.postContent}>
				<HTML html={post.content}
				      onLinkPress={(evt, href) => {
					      Linking.openURL(href);
				      }}/>
			</Text>
		</View>
	} catch (error) {
		console.error(`ShowPost: Error loading posts: ${util.errorMessage(error)} `);
		throw error;
	}

};
export default ShowPost;
