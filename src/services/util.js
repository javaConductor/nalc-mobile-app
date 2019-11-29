import sha256 from 'js-sha256';
import auth from "./auth";
import storage from "./storage";


export default {

	errorMessage: (thrownError) => {
		if (typeof thrownError === 'object') {
			return thrownError.errorMessage || thrownError.message;
		}
		return thrownError;
	},

	validEmail: (email) => {
		function hasWhiteSpace(s) {
			return /\s/g.test(s);
		}

		return email && email.includes('@') && !hasWhiteSpace(email);
	},

	passwordHash: (password) => {
		var hash = sha256.create();
		hash.update(password);
		return hash.hex();
	},

	removeCharacter: (str_to_remove, str) => {
		const reg = new RegExp(str_to_remove);
		return str.replace(reg, '')
	},

	handleHttpError: (fetchResponse, activity) => {
		const status = fetchResponse.status;
		// create message
		const message = (!fetchResponse.ok)
			? `Backend communication error${activity ? (' while trying to ' + activity) : ''}: (${status}): ${fetchResponse.statusText}`
			: `Backend communication ${activity ? ('performing ' + activity) : ''}: (${status}): ${fetchResponse.statusText}`;
		/// HTTP error
		const obj = {
			errorMessage: (!fetchResponse.ok) ? message : null,
			message: (fetchResponse.ok) ? message : null,
			status: status,
			ok: fetchResponse.ok,
			badToken: [401, 403].includes(status)
		};
		console.error(`handleHttpError: error: ${JSON.stringify(obj)}`);
		return obj;
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
			const resp = await auth.refreshToken();
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
	}
}