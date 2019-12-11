import React from 'react';
import config from '../config';
import storage from './storage';
import util from "./util";
import auth from './auth';


const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;

const self = {

	/**
	 *
	 * @returns {Promise<any>}
	 */
	getAdmins: async () => {
		try {
			const response = await fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`);
			if (!response.ok)
				throw util.handleHttpError(response, 'get admins');

			const responseJson = await response.json();
			console.log(`users.getAdmins: response: ${JSON.stringify(responseJson)}`);

			await storage.storeAdminList(responseJson);
			return responseJson;
		} catch (error) {
			console.error(`users.getAdmins: Error: ${util.errorMessage(error)}`);
			throw error;
		}
	},

	/**
	 *
	 * @param adminData
	 * @returns {Promise<*>}
	 */
	saveAdmin: async (adminData) => {
		return adminData.id ? self.updateAdmin(adminData) : self.addAdmin(adminData);
	},

	/**
	 *
	 * @param adminData
	 * @returns {Promise<any | *>}
	 */
	addAdmin: async (adminData) => {
		const accessToken = await auth.currentAccessToken();
		return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': accessToken,
			},
			body: JSON.stringify({...adminData, id: undefined}),
		})
			.then((resp) => {
				if (!resp.ok)
					throw util.handleHttpError(resp, 'add admin');
				return self.getAdmins();
			})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(JSON.stringify(responseJson));
				return responseJson;
			})
			.catch((error) => {
				console.error(`users.addAdmin: ERROR: ${util.errorMessage(error)}`);
				throw error;
			});
	},

	/**
	 *
	 * @param adminData
	 * @returns {Promise<any>}
	 * TODO: Change the backend to return the new list so we don't have to refetch
	 */
	updateAdmin: async (adminData) => {
		const accessToken = await auth.currentAccessToken();
		return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}/${adminData.id}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': accessToken,
			},
			body: JSON.stringify({...adminData, id: undefined}),
		})
			.then((resp) => {
				if (!resp.ok)
					throw util.handleHttpError(resp, 'update admin');
				return self.getAdmins();
			})
			.then((response) => {
				// if (!response.ok)
				// 	throw util.handleHttpError(response, 'get admins');
				console.log(`users.updateAdmin: response: ${JSON.stringify(response)}`);
				return response;
			})
			// .then((responseJson) => {
			// 	console.log(`users.updateAdmin: response: ${JSON.stringify(responseJson)}`);
			// 	return responseJson;
			// })
			.catch((error) => {
				console.error(`users.updateAdmin: ERROR: ${util.errorMessage(error)}`);
				//console.error(error);
				throw error;
			});
	},

	/**
	 *
	 * @param adminId
	 * @returns {Promise<any | *>}
	 */
	removeAdmin: async (adminId) => {
		console.log(`removeAdmin: ${adminId}`);

		const accessToken = await auth.currentAccessToken();
		return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}/${adminId}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'x-access-token': accessToken,
			},
		})
			.then((resp) => {
				//console.log(JSON.stringify(resp));
				if (!resp.ok)
					throw util.handleHttpError(resp, 'remove admin');
				return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`);
			})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(JSON.stringify(responseJson));
				return responseJson;
			})
			.catch((error) => {
				console.error(`users.removeAdmin: ERROR: ${util.errorMessage(error)}`);
				throw error;
			});
	},

	/**
	 *
	 * @param id
	 * @param email
	 * @returns {Promise<T | never>}
	 */
	checkEmailUsed: (id, email) => {
		return storage.getAdminList()
			.then((adminList) => {
				//console.log(`checkEmailUsed(${id}, ${email}): found: ${JSON.stringify(found)}`);
				return adminList.some((adm) => {
					//console.log(`checkEmailUsed(${id}, ${email}): comparing ${JSON.stringify(adm)} == ${adm.email.toUpperCase() === email.toUpperCase() && adm.id !== id}`);
					//console.log(`checkEmailUsed(${id}, ${email}): comparing ids ${adm.id !== id}`);
					//console.log(`checkEmailUsed(${id}, ${email}): comparing emails ${adm.email.toUpperCase() === email.toUpperCase()}`);

					return adm.email.toUpperCase() === email.toUpperCase() && adm.id !== id
				});
			})
			.catch((error) => {
				// log and rethrow
				console.error(`users.checkEmailUsed: ERROR: ${util.errorMessage(error)}`);
				throw error;
			});
	},

	/**
	 *
	 * @param adminId
	 * @param buffer
	 */
	addAdminPhoto: (adminId, buffer) => {
	},
};

self.getAdmins = auth.tokenWrapper(self.getAdmins);
self.addAdmin = auth.tokenWrapper(self.addAdmin);
self.removeAdmin = auth.tokenWrapper(self.removeAdmin);
self.updateAdmin = auth.tokenWrapper(self.updateAdmin);

export default self;
