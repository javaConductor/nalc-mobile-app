import React from 'react';
import config from '../config';
import auth from '../services/auth';
import util from "./util";


const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;

const self = {

	getCategories: async () => {
		try {
			const response = await fetch(`${backEndURL}/${config.BACKEND_CATEGORIES_PATH}`);
			if (!response.ok) throw util.handleHttpError(response, 'get categories');

			const responseJson = await response.json();
			//console.log(`categories: getCategories: ${JSON.stringify(responseJson, null, 2)}`);
			//console.log(`categories: getCategories filtered: ${JSON.stringify(filtered, null, 2)}`);
			return responseJson.filter((cat) => {
				return cat.name.toLowerCase() !== 'uncategorized';
			});
		} catch (error) {
			//log and rethrow
			console.error(`categories: getCategories: ERROR: ${JSON.stringify(error, null, 2)}`);
			throw error;
		}
	},

	addCategory: (categoryData) => {
		return auth.currentAccessToken().then((accessToken) => {
			console.log(`categories.addCategory: ${JSON.stringify(categoryData)}`);
			return fetch(`${backEndURL}/${config.BACKEND_CATEGORIES_PATH}`, {
				method: 'POST',
				headers: {
					'x-access-token': accessToken,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(categoryData),
			})
				.then((response) => {
					console.log(`categories.addCategory: response: ${JSON.stringify(response)}`);
					if (!response.ok)
						throw util.handleHttpError(response, 'add category');

					return response.json()
				})
				.then((responseJson) => {
					console.log(`categories.addCategory: responseJson: ${JSON.stringify(responseJson)}`);
					return {...responseJson};
				})
				.catch((error) => {
//                    console.error(`categories.addCategory: ERROR: ${JSON.stringify(error)}`);
					console.error(`categories.addCategory: ERROR: ${error}`);
					throw error;
				});
		});
	},

	/**
	 *
	 * @param categoryData
	 * @returns {Promise<any>}
	 * TODO: Change the backend to return the new list so we don't have to refetch
	 */
	updateCategory: (categoryData) => {
		return auth.currentAccessToken().then((accessToken) => {
			console.log(`categories.updateCategory: ${JSON.stringify(categoryData)}`);
			return fetch(`${backEndURL}/${config.BACKEND_CATEGORIES_PATH}/${categoryData.id}`, {
				method: 'POST',
				headers: {
					'x-access-token': accessToken,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({...categoryData, id: undefined}),
			})
				.then((response) => {
					console.log(`categories.updateCategory: response: ${JSON.stringify({...response})}`);
					console.log(`categories.updateCategory: response.status: ${JSON.stringify(response.status)}`);
					if (!response.ok)
						throw util.handleHttpError(response, 'update category');
					return response.json();
				})
				.then((responseJson) => {
					console.log(`categories.updateCategory: responseJson: ${JSON.stringify(responseJson)}`);
					return {...responseJson, ok: true};
//					return responseJson;
				})
				.catch((error) => {
					console.log(`categories.updateCategory: ERROR: ${JSON.stringify(error)}`);
					throw error;
				});
		});
	},

	removeAdmin: (adminId) => {
		console.log(`removeAdmin: ${adminId}`);

		return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}/${adminId}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		})
			.then((resp) => {
				//console.log(JSON.stringify(resp));
				if (!resp.ok)
					throw util.handleHttpError(resp, 'remove user');
				return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`);
			})
			.then((response) => {
				if (!response.ok)
					throw util.handleHttpError(response, 'get users');
				return response.json()
			})
			.then((responseJson) => {
				//console.log(JSON.stringify(responseJson));
				return {...responseJson, ok: true};
//				return responseJson;
			})
			.catch((error) => {
				console.error(error);
				throw error;
			});
	},

	addAdminPhoto: (adminId, buffer) => {
	},
};

//self.getCategories = util.tokenWrapper(self.getCategories);
self.addCategory = util.tokenWrapper(self.addCategory);
self.updateCategory = util.tokenWrapper(self.updateCategory);
self.removeAdmin = util.tokenWrapper(self.removeAdmin);

export default self;
