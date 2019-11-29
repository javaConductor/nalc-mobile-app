// ShowLastPost.js
import React, {useState} from 'react'
import storage from '../../services/storage';
import ShowPost from './show-post';


const ShowLastPost = async () => {

	const [post, setPost] = useState(null);

	// storage.getNewsPost()
	// 	.then((origPosts) => {
	// 		const posts = origPosts.reverse();// move the latest to the front
	// 		setPost(posts[0]);
	// 		console.log(`ShowLastPost: post: ${JSON.stringify(post, null, 2)}`);
	// 	})
	// 	.catch((error) => {
	// 		console.error(`ShowLastPost: Error loading posts: ${JSON.stringify(error)}`);
	// 		throw error;
	// 	});

	try {
		const origPosts = await storage.getNewsPost();
		const posts = origPosts.reverse();// move the latest to the front
		setPost(posts[0]);
		console.log(`ShowLastPost: post: ${JSON.stringify(post, null, 2)}`);
	} catch (error) {
		console.error(`ShowLastPost: Error loading posts: ${util.errorMessage(error)}`);
		throw error;
	}

	return (<ShowPost post={post}/>);
};

export default ShowLastPost;