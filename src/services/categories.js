import React from 'react';
import config from '../config';
import auth from '../services/auth';
import util from "./util";


const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;

const self = {

	getCategories: async () => {
		try {
			const response = await fetch(`${backEndURL}/${config.BACKEND_CATEGORIES_PATH}`);
			if (!response.ok) throw util.handleHttpError(response, 'get categoryService');
			const responseJson = await response.json();
			const result = responseJson.filter((cat) => {
				return cat.name.toLowerCase() !== 'uncategorized';
			});
			//console.log(`CategoryService: getCategories filtered: ${JSON.stringify(result, null, 2)}`);
			return result;
		} catch (error) {
			//log and rethrow
			console.error(`CategoryService: getCategories: ERROR: ${util.errorMessage(error)}`);
			throw error;
		}
	},

	addCategory: (categoryData) => {
		return auth.currentAccessToken().then((accessToken) => {
			console.log(`CategoryService.addCategory: ${JSON.stringify(categoryData)}`);
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
					console.log(`CategoryService.addCategory: response: ${JSON.stringify(response)}`);
					if (!response.ok)
						throw util.handleHttpError(response, 'add category');

					return response.json()
				})
				.then((responseJson) => {
					console.log(`CategoryService.addCategory: responseJson: ${JSON.stringify(responseJson)}`);
					return {...responseJson};
				})
				.catch((error) => {
//                    console.error(`categoryService.addCategory: ERROR: ${JSON.stringify(error)}`);
					console.error(`categoryService.addCategory: ERROR: ${util.errorMessage(error)}`);
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
	updateCategory: async (categoryData) => {
		try {
			console.log(`CategoryService.updateCategory: ${JSON.stringify(categoryData)}`);
			///////////////////////////////////////////////////////////////////
			/// Get accessToken
			///////////////////////////////////////////////////////////////////
			const accessToken = await auth.currentAccessToken();

			///////////////////////////////////////////////////////////////////
			/// Get response from backend
			///////////////////////////////////////////////////////////////////
			console.log(`CategoryService.updateCategory: POST: ${categoryData.id}`);
			const response = await fetch(`${backEndURL}/${config.BACKEND_CATEGORIES_PATH}/${categoryData.id}`, {
				method: 'POST',
				headers: {
					'x-access-token': accessToken,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({...categoryData, id: undefined}),
			});

			//console.log(`CategoryService.updateCategory: response.status: ${JSON.stringify(response.status)}`);
			if (!response.ok)
				throw util.handleHttpError(response, 'update category');

			///////////////////////////////////////////////////////////////////
			/// Get response from stream
			///////////////////////////////////////////////////////////////////
			console.log(`CategoryService.updateCategory: response.status: ${response.status}: reading stream.`);
			const responseJson = await response.json();
			console.log(`CategoryService.updateCategory: responseJson: ${JSON.stringify(responseJson)}`);
			return {...responseJson, ok: true};
		} catch (error) {
			console.error(`CategoryService.updateCategory: ERROR: ${util.errorMessage(error)}`);
			throw error;
		}
	},

	removeAdmin: (adminId) => {
		console.log(`CategoryService.removeAdmin: ${adminId}`);

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
				console.error(`CategoryService.removeAdmin: ERROR: ${util.errorMessage(error)}`);
				throw error;
			});
	},

	addAdminPhoto: (adminId, buffer) => {
	},
};

//self.getCategories = util.tokenWrapper(self.getCategories);
self.addCategory = auth.tokenWrapper(self.addCategory);
self.updateCategory = auth.tokenWrapper(self.updateCategory);
self.removeAdmin = auth.tokenWrapper(self.removeAdmin);

export default self;
