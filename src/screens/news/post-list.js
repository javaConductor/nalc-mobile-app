// PostList.js
import React, {Fragment} from 'react';
import {ListView, Text, View} from 'react-native'
import storage from '../../services/storage';
import styles from '../../screens/main-styles';
import ShowPost from './show-post';
import util from "../../services/util";


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

	componentDidMount = async () => {
		console.log(`PostList: componentDidMount loading posts.`);

		return storage.getNewsPosts()
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
				console.error(`PostList: componentDidMount: Error loading posts: ERROR: ${util.errorMessage(error)}`);

				throw error;
			})
	};

	render() {
		if (this.state.isLoading)
			return null;

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
		return <ShowPost post={post}/>
	}
}
