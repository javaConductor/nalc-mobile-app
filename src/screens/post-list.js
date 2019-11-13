// PostList.js
import React from 'react'
import {
    View,ListView,
    Text,
    Button,
    StyleSheet,
    AsyncStorage
} from 'react-native'
import Anchor from '../components/anchor';
import storage from '../services/storage';

export default class PostList extends React.Component {

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
                console.log(`PostList: componentDidMount loaded posts: ${JSON.stringify(posts,null,2)}`);
                const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
                const otherState = {newsPosts: posts,
                    isLoading:false,
                    dataSource: ds.cloneWithRows(posts)};
                this.setState((prevState) => { return {...prevState, ...otherState} })
            })
            .catch((error) => {
                console.error(`PostList: componentDidMount: Error loading posts: ${JSON.stringify(error)}`);
                throw error;
            })
    }

    //handling onPress action
    getListViewItem = (rowData) => {
        Alert.alert(rowData);
    }

    render() {
        if( this.state.isLoading)
            return null;

        return (
            <ListView
                contentContainerStyle={styles.wrapper}
                style={styles.container}
                dataSource={this.state.dataSource}
                renderRow={ this.renderPost.bind(this) }
                renderSeparator={(sectionId, rowId) =>
                    <View key={rowId} style={styles.separator} />}//adding separation
            />
        )
    }

    renderPost(post) {
        return <Text >{post.title}</Text>
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
});