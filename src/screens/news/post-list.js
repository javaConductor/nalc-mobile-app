// PostList.js
import React, {Fragment} from 'react';
import {ListView, Text, View} from 'react-native'
import storage from '../../services/storage';
import styles from '../../screens/main-styles';
import ShowPost from './show-post';
import util from "../../services/util";
//import config from '../../config';

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

	async checkForNewPosts() {
		const lastRead = await storage.getNewsPostsLastReadDate();
		if (lastRead.valueOf() > this.state.lastRead) {
			console.log(`PostList: checkForNewPosts: lastRead changed ${lastRead.toISOString()}.`);
			await this.componentDidMount();
		}
	}

	componentDidMount = async () => {
		console.log(`PostList: componentDidMount loading posts.`);
		return storage.getNewsPosts()
			.then(async (posts) => {
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
				const lastRead = await storage.getNewsPostsLastReadDate();
				this.setState((prevState) => {
					return {...prevState, ...otherState, lastRead}
				});

				if (!this.state.interval) {
					const interval = setInterval(this.checkForNewPosts.bind(this), (30 * 1000));
					this.setState((prevState) => {
						return {...prevState, interval}
					});
				}
			})
			.catch((error) => {
				console.error(`PostList: componentDidMount: Error loading posts: ERROR: ${util.errorMessage(error)}`);
				throw error;
			})
	};

	componentWillUnmount() {
		this.setState((prevState) => {
			return {...prevState, interval: null}
		});
	}

	render() {
		if (this.state.isLoading)
			return null;
		//console.log(`PostList: render: ${JSON.stringify(this.state.newsPosts,null,2)}.`);
		//console.log(`PostList: render: newPosts: ${this.state.newsPosts.length } dataSource: ${this.state.dataSource.getRowCount()}`);

		return (
			<Fragment>
				<Text style={styles.homeLabel}>N e w s</Text>
				<ListView
					contentContainerStyle={{...styles.wrapper}}
					style={{...styles.container}}
					dataSource={this.state.dataSource}
					renderRow={this.renderPost.bind(this)}
					renderSeparator={(sectionId, rowId) =>
						<View key={rowId} style={styles.separator}/>}//adding separation
				/>

			</Fragment>
		)
	}

	renderPost(post) {
		return <ShowPost key={post.id} post={post}/>
	}
}
