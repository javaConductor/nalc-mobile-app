import React from 'react';
import config from '../config';
import storage from '../services/storage';
import auth from '../services/auth';
import util from "./util";
import categoryService from '../services/categories';


const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;

/**
 *
 * @param post  { ..., featuredMediaId}
 * @returns Promise <{ ..., featuredMediaId, featuredMedia}>
 */
const updateMedia = (post) => {
	//console.log(`news.updateMedia ${post.id}: mediaId: ${post.featured_media}`);
	const p = post.featured_media <= 0 ? Promise.resolve(post)
		: self.getMedia(post.featured_media)
			.then((mediaObj) => {
				//const {guid: {rendered: mediaUrl}} = mediaObj;
				const mediaUrl = mediaObj.guid.rendered;
				//console.log(`news.updateMedia ${post.id}: ${mediaUrl}`);
				return {...post, featuredMedia: mediaUrl};
			})
			.catch((err) => {
				console.error(`news:updateMedia: ERROR ${util.errorMessage(err)}`);
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

	getNewsByDateAndCategories: (isoDateString, categories = []) => {
		if (!categories || categories.length == 0) {
			throw {errorMessage: 'Categories may not be null!!', ok: false};
		}
		const url = `${backEndURL}/${config.BACKEND_NEWS_READ_PATH}/${isoDateString}/${categories.join(',')}`;
		console.log(`news: getNewsByDateAndCategories(${isoDateString}, ${JSON.stringify(categories)}) fetching ${url}`);
		return fetch(url, {
			method: 'GET',
			headers: {
				// 'x-access-token': accessToken,
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			//body: JSON.stringify({date: isoDateString, categoryService: categoryService}),
		})
			.then((response) => response.json())
			///  Add featuredMedia to post if any
			.then((postList) => {
				postList = util.uniqueArray(postList, (post) => post.id);
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
			.then((posts) => {
				posts.sort((a, b) => b.modified.valueOf() - a.modified.valueOf());
				//console.log(`news: getNewsByDateAndCategories() sorted ${JSON.stringify(posts, null, 2)}`);
				return posts;
			})
			.catch((error) => {
				//log and rethrow
				console.error(`news: getNewsByDateAndCategories: ERROR: ${util.errorMessage(error)}`);
				throw error;
			});
	},
	/**
	 *
	 * @param postData = {content, title, categoryService}
	 */
	addNewsPost: (postData) => {
		const {image} = postData;
		return auth.currentAccessToken().then((accessToken) => {
			console.log(`news.addNewsPost: ${JSON.stringify(postData)}`);
			return fetch(`${backEndURL}/${config.BACKEND_NEWS_PATH}`, {
				method: 'POST',
				headers: {
					'x-access-token': accessToken,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({...postData, image: null, id: undefined}),
			})
				.then((response) => {
					if (!response.ok)
						throw util.handleHttpError(response, 'add post');
					return response.json();
				})
				.then((responseJson) => {
					console.log(`news.addNewsPost: response: ${JSON.stringify(responseJson)}`);
					if (image) {
						console.log(`news.addNewsPost: post: ${responseJson.id} image: ${JSON.stringify(image)}`);
						return self.uploadImage(responseJson.id, image);
					}
					return responseJson;
				})
				.catch((error) => {
					console.error(`news.addNewsPost: ERROR: ${util.errorMessage(error)} `);
					throw error;
				});
		});
	},

	uploadImage: async function (postId, uri) {
		const url = `${backEndURL}/${config.BACKEND_ADD_IMAGE_PATH}`;
		//console.log(`news.uploadImage(${postId}, ${JSON.stringify(uri)}) >> ${url}`);

		const accessToken = await auth.currentAccessToken();

		const [start, base64] = uri.split(';base64,', 2);
		const contentType = start.substr(5, start.length - 1);
		let [, fileType] = contentType.split('/');
		const fileName = `photo.${fileType === 'jpg' ? 'jpeg' : fileType}`;

		//data:image/png;base64,iVB
		console.log(`news.uploadImage: fileName: ${fileName}`);
		console.log(`news.uploadImage: contentType: ${JSON.stringify(contentType)}`);
		console.log(`news.uploadImage: base64.length: ${base64.length}`);

		const postData = {
			postId,
			fileName,
			contentType,
			base64Image: base64
		};

		let options = {
			method: 'POST',
			body: JSON.stringify(postData),
			headers: {
				Accept: 'application/json',
				'x-access-token': accessToken,
				'Content-Type': 'application/json',
			},
		};
		return fetch(url, options).then((response) => {
			if (!response.ok)
				throw util.handleHttpError(response, 'upload image for post');
			return response.json();
		});
	}
};

self.addNewsPost = auth.tokenWrapper(self.addNewsPost);
self.uploadImage = auth.tokenWrapper(self.uploadImage);

// create function read posts every N minutes after NEWS_POST_LAST_READ_DATE

const startCheckForNewPosts = () => {
	setInterval(() => checkForNewPosts(), (+config.NEWS_CHECK_INTERVAL_SECONDS * 1000));
};

const checkForNewPosts = () => {
	console.log(`news.checkForNewPosts() @ ${new Date().toISOString()}`);

	/// get the last time we read posts
	return storage.getNewsPostsLastReadDate()
		.then((dt) => {
			console.log(`news.checkForNewPosts: lastReadDate: ${dt.toISOString()}`);

			////Get the categoryService we care about
			return storage.getSelectedCategories()
				.then(async (categoryIds = []) => {
					console.log(`news.checkForNewPosts: selected category Ids: ${JSON.stringify(categoryIds)}`);
					/// in the ODD chance that there are no selected categories, we will get the full
					// list of categories from the backend and make them the selected categories
					if (!categoryIds || categoryIds.length == 0) {
						const categories = await categoryService.getCategories();
						console.log(`news.checkForNewPosts: all categories: ${JSON.stringify(categories)}`);
						categoryIds = categories.map((c) => c.id);
						console.log(`news.checkForNewPosts: new selected category Ids: ${JSON.stringify(categoryIds)}`);
						await storage.storeSelectedCategories(categoryIds);
					}

					/// get any new posts since dt in the categories we care about
					return self.getNewsByDateAndCategories(dt.toISOString(), categoryIds)
						.then((posts) => {
							posts.sort((a, b) => b.modified.valueOf() - a.modified.valueOf());
							//console.log(`news: checkForNewPosts() sorted ${JSON.stringify(posts, null,2)}`);
							return posts;
						})
						.then(async (newPosts = []) => {
							if (newPosts && newPosts.length > 0) {
								console.log(`news.checkForNewPosts: newPosts: ${JSON.stringify(newPosts, null, 2)}`);
								await storage.storeLastPostReadDate();
								/// get newPosts we have so far
								return storage.getNewsPosts()
									.then((oldPosts = []) => {
										//console.log(`news.checkForNewPosts: oldPosts: ${JSON.stringify(oldPosts, null, 2)}`);
										/// append the newPost to the list and store it
										const newPostList = [...oldPosts, ...newPosts];
										newPostList.sort((a, b) => b.id - a.id);
										return storage.storeNewsPosts(newPostList).then(() => {
											//console.log(`news.checkForNewPosts: stored new and Old Posts`);
											return newPostList;
										});
									})
							} else return [];
						});
				})
		})
		.catch((error) => {
			console.error(`news.checkForNewPosts: ERROR: ${util.errorMessage(error)} `);
			throw error;
		});
};

checkForNewPosts();
startCheckForNewPosts();

export default self;
