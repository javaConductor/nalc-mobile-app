// PostList.js
import React from 'react'
import {Linking, ListView, StyleSheet, Text, View} from 'react-native'
import storage from '../services/storage';
import HTML from 'react-native-render-html';


export default class PostList extends React.Component {
	static navigationOptions = {
		title: 'News',
	};

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true
		}
	}

	async componentDidMount() {
		console.log(`PostList: componentDidMount loading posts.`);

		storage.getNewsPosts()
			.then((posts) => {
				posts = posts.sort((a, b) => {
					return (a.date.valueOf() < b.date.valueOf()) ? 1 : -1;
				});
				//console.log(`PostList: componentDidMount loaded posts: ${JSON.stringify(posts, null, 2)}`);
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
		if (this.state.isLoading)
			return null;

		return (
			<ListView
				contentContainerStyle={{...styles.wrapper}}
				style={{...styles.container}}
				dataSource={this.state.dataSource}
				renderRow={this.renderPost.bind(this)}
				renderSeparator={(sectionId, rowId) =>
					<View key={rowId} style={styles.separator}/>}//adding separation
			/>
		)
	}

	renderPost(post) {
		var options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
		const dateStr = new Date(post.date).toLocaleString("en-US", options);
		return <View style={{...styles.post}}>
			<Text>{dateStr}</Text>
			<Text style={styles.postTitle}>{post.title}</Text>
			<Text style={styles.postContent}>
				<HTML html={post.content}
				      onLinkPress={(evt, href) => {
					      Linking.openURL(href);
				      }}/>
			</Text>
			{/*<View key={post.id} style={styles.separator}/>*/}
		</View>
	}
}

const styles = StyleSheet.create({

	separator: {
		flex: 1,
		width: '100%',
//        height: 10,//StyleSheet.hairlineWidth,
		//      backgroundColor: '#8E8E8E',
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		marginBottom: 10,
		marginTop: 5,

	},
	wrapper: {
		justifyContent: 'center',
		alignItems: 'stretch',
		width: '100%',

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
});