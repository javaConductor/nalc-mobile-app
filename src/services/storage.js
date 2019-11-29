import React from 'react';
import {AsyncStorage} from 'react-native';

//// Storage KEYS
const ADMIN_LIST = "admins-list";
const AUTH_INFO = "auth-info";
const SELECTED_CATEGORIES = "SELECTED-CATEGORIES";
const NEWS_POSTS = "NEWS_POSTS";
const NEWS_POSTS_LAST_READ = "NEWS_POSTS_LAST_READ";
const SETUP_FLAG = "SETUP";

const self = {

	////////////////////
	//////// SETUP FLAG
	////////////////////
	storeSetupFlag: async (setupFlag) => {
		console.log(`storage.storeSetupFlag(${setupFlag})`);
		(setupFlag ? AsyncStorage.setItem(SETUP_FLAG, setupFlag) : AsyncStorage.removeItem(SETUP_FLAG))
			.catch((e) => {
				console.error(`Error storing Setup Flag ${e} `);
			});
	},
	getSetupFlag: async () => {
		const setupFlag = await AsyncStorage.getItem(SETUP_FLAG);
		return (setupFlag);
	},

	////////////////////
	//////// ADMIN LIST
	////////////////////
	storeAdminList: async (adminList) => {
		AsyncStorage.setItem(ADMIN_LIST, JSON.stringify(adminList))
			.catch((e) => {
				console.error(`Error storing Admin list ${e} `);
			});
	},
	getAdminList: async () => {
		const adminListStr = await AsyncStorage.getItem(ADMIN_LIST);
		return JSON.parse(adminListStr);
	},

	////////////////////
	///////// AUTH INFO
	////////////////////
	storeAuthInfo: async (authInfo) => {
		console.log(`storage.storeAuthInfo(): Storing Auth Info: ${JSON.stringify(authInfo, null, 2)} `);
		return AsyncStorage.setItem(AUTH_INFO, JSON.stringify(authInfo))
			.catch((e) => {
				console.error(`storage.storeAuthInfo(): Error storing Auth Info: ${e} `);
			});
	},

	getAuthInfo: async () => {
		const authInfoStr = await AsyncStorage.getItem(AUTH_INFO);
		//console.log(`storage.getAuthInfo(): Auth Info String: ${authInfoStr} `);
		return JSON.parse(authInfoStr);
	},

	///////////////////////////////
	///////// SELECTED CATEGORIES
	//////////////////////////////
	storeSelectedCategories: async (selectedCategories) => {
		console.log(`storage.storeSelectedCategories(): Storing: ${JSON.stringify(selectedCategories, null, 2)} `);

		return AsyncStorage.setItem(SELECTED_CATEGORIES, JSON.stringify(selectedCategories))
			.catch((e) => {
				console.error(`storage.storeSelectedCategories(): Error storing Selected Categories ${e} `);
			});
	},

	/**
	 *
	 * @returns {Promise<[categoriesId, ...]>}
	 */
	getSelectedCategories: async () => {
		return AsyncStorage.getItem(SELECTED_CATEGORIES)
			.then((catStr) => {
				return JSON.parse(catStr);
			})
			.catch((e) => {
				console.error(`storage.getSelectedCategories() Error getting Selected Categories: ${e} `);
				throw e;
			});
	},

	// updateAdmin: (adminId, adminData) => {
	// 	/// get the admin list
	// 	/// find the one with id == adminId
	// 	/// overwrite its data with adminData
	// 	/// store the list again
	// },
	// addAdmin: (adminData) => {
	//
	// },
	storeNewsPosts: (posts) => {
		// store posts and time
		//console.log(`storage.storeNewsPosts(): Storing: ${JSON.stringify(posts, null, 2)} `);
		return AsyncStorage.setItem(NEWS_POSTS, JSON.stringify(posts))
			.then(() => {
				return AsyncStorage.setItem(NEWS_POSTS_LAST_READ, new Date().toISOString())
			})
			.catch((e) => {
				console.error(`storage.storeNewsPosts(): Error storing News Posts ${e} `);
			});
	},
	getNewsPosts: () => {
		return AsyncStorage.getItem(NEWS_POSTS)
			.then((newsStr) => {
				//console.log(`storage.getNewsPosts() newsStr: ${newsStr}`);
				return newsStr ? JSON.parse(newsStr) : [];
			})
			.catch((e) => {
				console.error(`storage.getNewsPosts() Error getting News Posts: ${e} `);
				throw e;
			});
	},
	getNewsPost: async (postId) => {
		const posts = await self.getNewsPosts();
		return posts.find((post, i) => post.id == postId);
	},
	getNewsPostsLastReadDate: () => {
		return AsyncStorage.getItem(NEWS_POSTS_LAST_READ)
			.then((isoDateString) => {
				/// if no date found then go back a month
				if (!isoDateString) {
					var d = new Date();
					d.setFullYear(d.getFullYear() - 1);
					isoDateString = d.toISOString();
				}
				const dt = new Date(isoDateString);
				console.log(`storage.getNewsPostsLastReadDate(): Post last read on: ${dt.toISOString()} `);
				return dt;
			})
			.catch((e) => {
				console.error(`storage.getNewsPostsLastReadDate() Error getting News Posts Lst Read Date: ${e} `);
				throw e;
			});
	},

};

export default self;
