import config from "../config";
import storage from "./storage";
import utils from './util';


const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;

const self = {

	currentUser: async () => {
		const authInfo = await storage.getAuthInfo();
		//console.log(`auth: currentUser(): ${JSON.stringify(authInfo)}`);
		return authInfo;
	},

	_canManage: (authInfo) => {
		if (!authInfo)
			return false;
		return (authInfo.permissions && authInfo.permissions.includes('M'));
	},

	userState: {
		hasAuthenticated: false,
		canManage: false
	},
	hasAuthenticated: false,
	currentAccessToken: async () => {
		console.log(`auth.currentAccessToken: getting authInfo.`);

		const authInfo = await self.currentUser();
		console.log(`auth.currentAccessToken:  authInfo: ${JSON.stringify(authInfo)}.`);

		if (!authInfo) throw {errorMessage: "User Not Authenticated !!"}; //return Promise.reject("User Not Authenticated !!");
		if (!authInfo.accessToken) throw {errorMessage: "User Not Authenticated !!"}; //return Promise.reject("User Not Authenticated !!");
		console.log(`auth.currentAccessToken:  accessToken: ${authInfo.accessToken}.`);
		return authInfo.accessToken;
	},

	isUserAuthenticated: async () => {
		return storage.getAuthInfo().then(authInfo => self._tokenValid(authInfo));
	},
	_tokenValid: (authInfo) => {
		if (!authInfo)
			return false;
		//console.log(`auth: _tokenValid: authInfo: ${JSON.stringify(authInfo, null, 2)}`);
		/// check for valid token
		return !!authInfo.accessToken;
	},
	logoff: async () => {
		const authInfo = await storage.getAuthInfo();
		const {refreshToken, username, accessToken} = authInfo;
		console.log(`auth.logoff:  username: ${username}`);

		const response = await fetch(`${backEndURL}/${config.BACKEND_AUTH_PATH}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({username}),
		});

		await storage.storeAuthInfo({});
		self.userState = {
			hasAuthenticated: false,
			canManage: false
		};
	},

	currentUserCanManageAdmins: () => {
		if (!self.userState.hasAuthenticated)
			return false;
		return storage.getAuthInfo()
			.then((authInfo) => {
				authInfo = authInfo || {};
				console.log(`currentUserCanManageAdmins: authInfo ${JSON.stringify(authInfo)}`);
				return self._canManage(authInfo);
			})
			.catch((err) => {
				console.error(`currentUserCanManageAdmins: Error checking user permissions ${utils.errorMessage(err)}`);
			});
	},

	authenticate: async (email, passwordHash) => {
		try {
			//////////////////////////////////////////////////////////////////////////////
			//// Clear the user info
			//////////////////////////////////////////////////////////////////////////////
			await storage.storeAuthInfo({});
			self.userState = {};
			//////////////////////////////////////////////////////////////////////////////
			// Send Authenticate request to backend
			//////////////////////////////////////////////////////////////////////////////
			const response = await fetch(`${backEndURL}/${config.BACKEND_AUTH_PATH}`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({username: email, passwordHash}),
			});

			//////////////////////////////////////////////////////////////////////////////
			//// Read the response stream
			//////////////////////////////////////////////////////////////////////////////
			const responseJson = await response.json();
			console.log(`auth: authenicate: response: ${JSON.stringify(responseJson, null, 2)}`);

			//console.log(`auth: authenicate: response: ${JSON.stringify(responseJson, null, 2)}`);
			if (!responseJson.authenticated) {
				throw {errorMessage: responseJson.message};
			}

			//////////////////////////////////////////////////////////////////////////////
			//// Authentication succeeded. Store the new user info
			//////////////////////////////////////////////////////////////////////////////
			await storage.storeAuthInfo(responseJson);

			//////////////////////////////////////////////////////////////////////////////
			/// Check whether user canManage other Administrators
			//////////////////////////////////////////////////////////////////////////////
			const canManage = await self._canManage(responseJson);
			console.log(`auth.authenticate(): canManage: ${canManage} authInfo: ${JSON.stringify(responseJson)}`);
			self.userState = {hasAuthenticated: true, canManage: canManage};
			return responseJson;
		} catch (error) {
			self.userState = {};
			console.error(`auth.authenticate(): ERROR: ${utils.errorMessage(error)}`);
			throw error;
		}
	},

	/**
	 *
	 *
	 * All the functions should return the regular payload or throw {ok:false, message:'...', tokenExpired:treu/false }
	 * @param fnAction
	 * @returns {{ok: boolean}}
	 */
	tokenWrapper: (fnAction) => {

		const doRefresh = async (args) => {
			const resp = await self.refreshToken();
			console.log(`tokenWrapper doRefresh: ${JSON.stringify(resp)}`);
			const retVal = {ok: false};

			if (resp.badToken) {
				await storage.storeAuthInfo({});
				throw {...resp, authenticationRequired: true};
			}

			try {
				const ret = await fnAction.apply(this, args);
				return ret;
			} catch (e) {
				if (typeof e === 'object') {
					retVal.message = e.message;
					return e;
				}
				retVal.message = e;
				return retVal;
			}
		};

		return async function () {
			//console.log(`tokenWrapper function ${fnAction.name} args: ${JSON.stringify(arguments)}`);
			const retVal = {ok: false};

			try {
				return await fnAction.apply(this, arguments);
			} catch (e) {
				if (typeof e === 'object') {
					retVal.message = e.message;
					return (e.badToken) ? doRefresh(arguments) : e;
				}
				retVal.message = e;
				return retVal;
			}
		};
	},

	refreshToken: async () => {
		/// get the current authInfo
		const authInfo = await self.currentUser();

		/// send {refreshToken, username, accessToken}  to the /auth/refreshToken
		const {refreshToken, username, accessToken} = authInfo;
		const response = await fetch(`${backEndURL}/${config.BACKEND_REFRESH_TOKEN_PATH}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({refreshToken, username, accessToken}),
		});

		/// check for bad status
		if (!response.ok) {
			return utils.handleHttpError(response, 'refresh token');
		}

		/// read the JSON response from stream
		const responseJson = await response.json();
		authInfo.accessToken = responseJson.accessToken;
		authInfo.accessTokenExpire = responseJson.accessTokenExpire;
		/// Store the
		await storage.storeAuthInfo(authInfo);
		return responseJson;
	},
};

self.currentUser().then((authInfo) => {
	self.userState = {
		hasAuthenticated: self._tokenValid(authInfo),
		canManage: self._canManage(authInfo)
	};
});

export default self;
