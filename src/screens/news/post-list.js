// PostList.js
import React from 'react';
import {ScrollView, Text, View} from 'react-native'
import storage from '../../services/storage';
import styles from '../../screens/main-styles';
import ShowPost from './show-post';
import util from "../../services/util";
import MenuButton from "../../components/menu/menu-button";
import Styles from "../main-styles";


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
				posts = util.uniqueArray(posts, post => post.id);

				posts = posts.sort((a, b) => {
					return (a.date.valueOf() < b.date.valueOf()) ? 1 : -1;
				});
				console.log(`PostList: componentDidMount loaded posts: ${JSON.stringify(posts, null, 2)}`);
				const otherState = {
					newsPosts: posts,
					isLoading: false,
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
			<View style={styles.container}>
				<MenuButton navigation={this.props.navigation}/>
				<View style={{alignContent: 'center', width: '100%'}}>
					<Text style={Styles.screenTitle}>N e w s</Text>
				</View>

				<ScrollView>
					{this.state.newsPosts.map(this.renderPost.bind(this))}
				</ScrollView>

			</View>
		)
	}

	renderPost(post) {
		return <ShowPost key={post.id} post={post}/>
	}
}
