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
	hasAuthenticated: false,

	currentAccessToken: async () => {
		const authInfo = await self.currentUser();

		if (!authInfo) throw "User Not Authenticated !!"; //return Promise.reject("User Not Authenticated !!");
		if (!authInfo.accessToken) throw "User Not Authenticated !!";//return Promise.reject("User Not Authenticated !!");
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
		self.hasAuthenticated = false;
		return storage.storeAuthInfo({});
	},

	currentUserCanManageAdmins: () => {
		if (!self.isUserAuthenticated())
			return false;
		return storage.getAuthInfo()
			.then((authInfo) => {
				authInfo = authInfo || {};
				console.log(`currentUserCanManageAdmins: authInfo ${JSON.stringify(authInfo)}`);
				return (authInfo.permissions && authInfo.permissions.includes('M'));
			})
			.catch((err) => {
				console.error(`currentUserCanManageAdmins: Error checking user permissions ${utils.errorMessage(err)}`);
			});
	},

	authenticate: (email, passwordHash) => {
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
					.then((responseJson) => {
						console.log(`auth: authenicate: response: ${JSON.stringify(responseJson, null, 2)}`);
						if (!responseJson.authenticated) {
							throw {errorMessage: responseJson.message};
						}
						self.hasAuthenticated = true;
						storage.storeAuthInfo(responseJson);
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

		const responseJson = await response.json();
		authInfo.accessToken = responseJson.accessToken;
		authInfo.accessTokenExpire = responseJson.accessTokenExpire;
		storage.storeAuthInfo(authInfo);
		return responseJson;
	},
};

self.isUserAuthenticated().then((isAuthenticated) => {
	self.hasAuthenticated = isAuthenticated
});

export default self;
