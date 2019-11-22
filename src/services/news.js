import React from 'react';
import config from '../config';
import storage from '../services/storage';
import auth from '../services/auth';


const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;

/**
 *
 * @param post  { ..., featuredMediaId}
 * @returns Promise <{ ..., featuredMediaId, featuredMedia}>
 */
const updateMedia = (post) => {
	console.log(`news.updateMedia ${post.id}: mediaId: ${post.featured_media}`);
	const p = post.featured_media <= 0 ? Promise.resolve(post)
		: self.getMedia(post.featured_media)
			.then((mediaObj) => {
				//const {guid: {rendered: mediaUrl}} = mediaObj;
				const mediaUrl = mediaObj.guid.rendered;
				console.log(`news.updateMedia ${post.id}: ${mediaUrl}`);
				return {...post, featuredMedia: mediaUrl};
			})
			.catch((err) => {
				console.error(`news:updateMedia: ERROR ${err}`);
				throw err;
			});
	return p;
};

const self = {

	getMedia: (mediaId) => {
		const url = `${backEndURL}/${config.BACKEND_MEDIA_PATH}/${mediaId}`;
		console.log(`news: getMedia(${mediaId}) fetching ${url}`);
		return fetch(url, {
			method: 'GET',
			headers: {
				// 'x-access-token': accessToken,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((responseJson) => {
				//console.log(`news: getMedia(${mediaId}) response ${JSON.stringify(responseJson, null, 2)}`);
				return responseJson;
			})

	},
	getNewsByDateAndCategories: (isoDateString, categories) => {
		const url = `${backEndURL}/${config.BACKEND_NEWS_READ_PATH}/${isoDateString}/${categories.join(',')}`;
		console.log(`news: getNewsByDateAndCategories(${isoDateString}, ${JSON.stringify(categories)}) fetching ${url}`);
		return fetch(url, {
			method: 'GET',
			headers: {
				// 'x-access-token': accessToken,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			//body: JSON.stringify({date: isoDateString, categories: categories}),
		})
			.then((response) => response.json())
			///  Add featuredMedia to post if any
			.then((postList) => {
				//console.log(`news: getNewsByDateAndCategories: ${JSON.stringify(postList, null, 2)}`);
				const promiseList = postList.map(updateMedia);
				return Promise.all(promiseList)
			})
			/// Get the needed fields from the post
			.then((responseJson) => {
				//console.log(`news: getNewsByDateAndCategories: ${responseJson}`);
				const filtered = responseJson
					.map((post) => {
						//console.log(`news: getNewsByDateAndCategories: map post ${JSON.stringify(post.title, null, 2)} `);
						const {id, date, modified, title: {rendered: title}, content: {rendered: content}, excerpt: {rendered: excerpt}, author: authorId, featured_media: featuredMediaId, featuredMedia} = post;
						const smaller = {
							id,
							date,
							modified,
							title,
							content,
							excerpt,
							authorId,
							featuredMediaId,
							featuredMedia
						};
						//console.log(`news: getNewsByDateAndCategories: smaller post ${JSON.stringify(smaller, null, 2)} `);
						return smaller;
					});
				//console.log(`news: getNewsByDateAndCategories filtered: ${JSON.stringify(filtered, null, 2)}`);
				return filtered;
			})

			// .then((postsWithMedia) => {
			//     console.log(`news: getNewsByDateAndCategories posts With Media: ${JSON.stringify(postsWithMedia, null, 2)}`);
			//     return postsWithMedia;
			// })
			.catch((error) => {
				//log and rethrow
				console.error(`news: getNewsByDateAndCategories: ERROR: ${JSON.stringify(error, null, 2)}`);
				throw error;
			});
	},
	/**
	 *
	 * @param postData = {content, title, categories}
	 */
	addNewsPost: (postData) => {
		return auth.currentAccessToken().then((accessToken) => {
			console.log(`news.addPost: ${JSON.stringify(postData)}`);
			return fetch(`${backEndURL}/${config.BACKEND_NEWS_PATH}`, {
				method: 'POST',
				headers: {
					'x-access-token': accessToken,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({...postData, id: undefined}),
			})
				.then((response) => response.json())
				.then((responseJson) => {
					console.log(`news.addPost: ${JSON.stringify(responseJson)}`);
					return responseJson;
				})
				.catch((error) => {
					console.error(`news.addPost: ERROR: ${JSON.stringify(error)}`);
					throw error;
				});
		});
	},
};

// create function read posts every N minutes after NEWS_POST_LAST_READ_DATE

const startCheckForNewPosts = () => {
	setInterval(() => checkForNewPosts(), (+config.NEWS_CHECK_INTERVAL_SECONDS * 1000));
};

const checkForNewPosts = () => {
	console.log(`news.checkForNewPosts()`);

	/// get the last time we read posts
	return storage.getNewsPostsLastReadDate()
		.then((dt) => {
			console.log(`news.checkForNewPosts: lastReadDate: ${dt.toISOString()}`);
			/// get the categories we care about
			return storage.getSelectedCategories()
				.then((categoryIds) => {
					console.log(`news.checkForNewPosts: selected categories: ${JSON.stringify(categoryIds)}`);
					/// get any new posts since dt in the categories we care about
					return self.getNewsByDateAndCategories(dt.toISOString(), categoryIds)
						.then((newPosts) => {
							console.log(`news.checkForNewPosts: newPosts: ${JSON.stringify(newPosts, null, 2)}`);
							/// get newPosts we have so far
							return storage.getNewsPosts()
								.then((oldPosts) => {
									//console.log(`news.checkForNewPosts: oldPosts: ${JSON.stringify(oldPosts, null, 2)}`);
									/// append the newPost to the list and store it
									const newPostList = [...oldPosts, ...newPosts];
									//console.log(`news.checkForNewPosts: storing new and Old Posts: ${JSON.stringify(newPostList, null, 2)}`);
									return storage.storeNewsPosts(newPostList).then(() => {
										//console.log(`news.checkForNewPosts: stored new and Old Posts`);
										return newPostList;
									});
								})
						});
				})
		})
		.catch((error) => {
			console.error(`news.checkForNewPosts: ERROR: ${JSON.stringify(error)}`);
			throw error;
		});
};

checkForNewPosts();
startCheckForNewPosts();

export default self;
