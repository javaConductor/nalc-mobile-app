import sha256 from 'js-sha256';
import * as Font from "expo-font";
// import storage from "./storage";

const self = {

	getAvailableRoutes: navigation => {
		let availableRoutes = [];
		if (!navigation) return availableRoutes;

		const parent = navigation.dangerouslyGetParent();
		if (parent) {
			if (parent.router && parent.router.childRouters) {
				// Grab all the routes the parent defines and add it the list
				availableRoutes = [
					...availableRoutes,
					...Object.keys(parent.router.childRouters),
				];
			}

			// Recursively work up the tree until there are none left
			availableRoutes = [...availableRoutes, ...self.getAvailableRoutes(parent)];
		}

		// De-dupe the list and then remove the current route from the list
		return [...new Set(availableRoutes)].filter(
			route => route !== navigation.state.routeName
		);
	},

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

	validURL(url) {
		const urlRegex = /(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/;
		const goodURL = urlRegex.test(url);
		return goodURL;
	},

	passwordHash: (password) => {
		const hash = sha256.create();
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
	getCircularReplacer: () => {
		const seen = new WeakSet();
		return (key, value) => {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) {
					return;
				}
				seen.add(value);
			}
			return value;
		};
	},
	/**
	 *
	 * @param arr {unknown[]}
	 * @param uniqueValueFn (obj) => obj.uniqueValue
	 * @returns {unknown[]}
	 */
	uniqueArray(arr, uniqueValueFn = (x) => x) {
		const list = arr || [];
		const obj = list.reduce((m, value) => {
			m[uniqueValueFn(value)] = value;
			return {...m, [uniqueValueFn(value)]: value};
		}, {});
		return Object.values(obj);
	},
	async loadFonts() {
		await Font.loadAsync({
			'Oswald-Bold': require('../../assets/fonts/Oswald-Bold.ttf'),
			'OswaldHeavy-Regular': require('../../assets/fonts/OswaldHeavy-Regular.ttf'),
		});
	},

};
export default self;