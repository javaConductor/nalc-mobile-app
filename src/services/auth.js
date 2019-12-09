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
			const canManage = self._canManage(responseJson);
			self.userState = {hasAuthenticated: true, canManage: canManage};
			return responseJson;
		} catch (error) {
			console.error(`auth.authenticate(): ERROR: ${utils.errorMessage(error)}`);
			throw error;
		}
	},

	authenticateThen: async (email, passwordHash) => {
		return storage.storeAuthInfo({})
			.then(() => {
				return fetch(`${backEndURL}/${config.BACKEND_AUTH_PATH}`, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({username: email, passwordHash}),
				})
					.then((response) => response.json())
					.then(async (responseJson) => {
						console.log(`auth: authenicate: response: ${JSON.stringify(responseJson, null, 2)}`);
						if (!responseJson.authenticated) {
							throw {errorMessage: responseJson.message};
						}
						self.userState.hasAuthenticated = true;
						await storage.storeAuthInfo(responseJson);
						return responseJson;
					})
					.catch((error) => {
						console.error(`auth.authenticate(): ERROR: ${utils.errorMessage(error)}`);
						throw error;
					});
			});
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
