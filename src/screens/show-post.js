// ShowPost.js
import React from 'react'
import {Linking, ListView, StyleSheet, Text, View} from 'react-native'
import storage from '../services/storage';
import HTML from 'react-native-render-html';


export default class ShowPost extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			post: this.props.navigation.state.params.post || this.props.post
		};
	}

	async componentDidMount() {
		console.log(`ShowPost: componentDidMount loading posts.`);

		storage.getNewsPosts()
			.then((posts) => {
				posts = posts.reverse();
				console.log(`PostList: componentDidMount loaded posts: ${JSON.stringify(posts, null, 2)}`);
				const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
				const otherState = {
					newsPosts: posts,
					isLoading: false,
					dataSource: ds.cloneWithRows(posts)
				};
				this.setState((prevState) => {
					return {...prevState, ...otherState}
				})
			})
			.catch((error) => {
				console.error(`PostList: componentDidMount: Error loading posts: ${JSON.stringify(error)}`);
				throw error;
			})
	}

	render() {
		const post = this.state.post;
		const dateStr = new Date(post.date).toLocaleDateString();
		return <View style={styles.post}>
			<Text>{dateStr}</Text>
			<Text style={styles.postTitle}>{post.title}</Text>
			<Text style={styles.postContent}>
				<HTML html={post.content}
				      onLinkPress={(evt, href) => {
					      Linking.openURL(href);
				      }}/>
			</Text>
		</View>
	}

}

const styles = StyleSheet.create({

	separator: {
		flex: 1,
		height: StyleSheet.hairlineWidth,
		backgroundColor: '#8E8E8E',
	},
	wrapper: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	post: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 5,
	},
	postTitle: {
		color: 'maroon',
		fontSize: 20,
		backgroundColor: 'white',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	postContent: {
		color: 'navy',
		backgroundColor: 'white',
		marginLeft: 5,
		marginRight: 5,
	},
});