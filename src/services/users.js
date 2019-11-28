import React from 'react';
import config from '../config';
import storage from './storage';
import util from "./util";
import auth from './auth';


const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;

const self = {

	getAdmins: () => {
		return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`)
		// .then((response) => response.json())
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(JSON.stringify(responseJson));
				storage.storeAdminList(responseJson);
				return responseJson;
			})
			.catch((error) => {
				console.error(error);
				throw error;
			});
	},

	saveAdmin: async (adminData) => {
		return adminData.id ? self.updateAdmin(newAdmin) : self.addAdmin(newAdmin);
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
				return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`);
			})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(JSON.stringify(responseJson));
				return responseJson;
			})
			.catch((error) => {
				console.error(error);
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
				return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`);
			})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log(JSON.stringify(responseJson));
				return responseJson;
			})
			.catch((error) => {
				//console.error(error);
				throw error;
			});
	},

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
				console.error(error);
				throw error;
			});
	},

	checkEmailUsed: (id, email) => {
		return storage.getAdminList()
			.then((adminList) => {
				const found = adminList.some((adm) => {
					console.log(`checkEmailUsed(${id}, ${email}): comparing ${JSON.stringify(adm)} == ${adm.email.toUpperCase() === email.toUpperCase() && adm.id !== id}`);
					//console.log(`checkEmailUsed(${id}, ${email}): comparing ids ${adm.id !== id}`);
					//console.log(`checkEmailUsed(${id}, ${email}): comparing emails ${adm.email.toUpperCase() === email.toUpperCase()}`);

					return adm.email.toUpperCase() === email.toUpperCase() && adm.id !== id
				});
				console.log(`checkEmailUsed(${id}, ${email}): found: ${JSON.stringify(found)}`);
				return found;
			})
			.catch((error) => {
				// log and rethrow
				console.error(`Error checking if email is used: ${error}`);
				throw error;
			});
	},

	addAdminPhoto: (adminId, buffer) => {
	},
};

self.addAdmin = util.tokenWrapper(self.addAdmin);
self.removeAdmin = util.tokenWrapper(self.removeAdmin);
self.updateAdmin = util.tokenWrapper(self.updateAdmin);

export default self;