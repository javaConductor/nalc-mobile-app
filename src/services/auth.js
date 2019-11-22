import config from "../config";
import storage from "./storage";


const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;

const self = {

	currentUser: async () => {
		const authInfo = await storage.getAuthInfo();
		console.log(`auth: currentUser(): ${JSON.stringify(authInfo)}`);
		return authInfo;
	},

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
		console.log(`auth: _tokenValid: authInfo: ${JSON.stringify(authInfo, null, 2)}`);
		/// check for valid token
		return !!authInfo.accessToken;
	},

	logoff: () => {
		return storage.storeAuthInfo({});
	},
	currentUserCanManageAdmins: () => {
		if (!self.isUserAuthenticated())
			return false;
		return storage.getAuthInfo()
			.then(authInfo => {
				console.log(`currentUserCanManageAdmins: user ${authInfo.username} has permissions: ${authInfo.permissions}`);
				return (authInfo.permissions && authInfo.permissions.includes('M'));
			})
			.catch((err) => {
				console.error(`currentUserCanManageAdmins: Error checking user permissions ${err}`);
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
							throw responseJson.message;
						}
						storage.storeAuthInfo(responseJson);
						return responseJson;
					})
					.catch((error) => {
						console.error(`auth.authenticate(): ERROR: ${JSON.stringify(error, null, 2)}`);
					});
			});
	},
};
export default self;
