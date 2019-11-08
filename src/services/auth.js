import config from "../config";
import storage from "./storage";

const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;

const self = {

    isUserAuthenticated: async () => {
       return  storage.getAuthInfo().then(authInfo => self._tokenValid(authInfo) );
    },

    _tokenValid: (authInfo) => {
        console.log(`auth: _tokenValid: authInfo: ${JSON.stringify(authInfo, null, 2)}`);
        /// check for valid token
        return !!authInfo.accessToken;
    },

    logoff: () => {
        return storage.storeAuthInfo({});
    },

    authenticate: (email, passwordHash) => {
            return storage.storeAuthInfo({})
                .then( () => {
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
                    storage.storeAuthInfo(responseJson);
                    return responseJson;
                })
                .catch((error) =>{
                    console.error(`auth.authenticate(): ERROR: ${JSON.stringify(error, null, 2)}`);
                });
        });
    },
}
export default self;
