import storage from './storage';
import categoryService from './categories';
import news from './news';
import util from "./util";


export default {

	initApp: async () => {

		/// check storage for setupDone flag
		/// if none
		///     get the categoryService and select all of them
		//      load the last year's
		///     set the last loaded date for today
		try {
			console.log(`initApp: getting setupFlag from storage.`);
			///////////////////////////////////////////////////////////////////
			/// Check if the app has already been setup
			///////////////////////////////////////////////////////////////////
			const setupFlag = await storage.getSetupFlag();
			console.log(`initApp: checking setupFlag: ${setupFlag}`);
			if (setupFlag)
				return false; // indicate we did NOT do the setup process
//			console.log(`initApp: setupFlag must be falsy: getting categoryService.`);

			///////////////////////////////////////////////////////////////////
			/// Get the full list of categoryService
			///////////////////////////////////////////////////////////////////
			const categories = await categoryService.getCategories();
			//console.log(`initApp: got categories ${JSON.stringify(categories)}`);
			const userInterests = categories.map((category) => (category.id));
			//console.log(`initApp: userInterests list: ${JSON.stringify(userInterests)}. Storing in storage.`);

			///////////////////////////////////////////////////////////////////
			/// Initially assign user to ALL categoryService - can be changed later
			///////////////////////////////////////////////////////////////////
			await storage.storeSelectedCategories(userInterests);
			const dt = new Date();
			dt.setFullYear(dt.getFullYear() - 1);
			const categoryIds = categories.map(cat => cat.id);
			console.log(`initApp: getting posts from ${dt.toString()} with categories ${JSON.stringify(categoryIds)}.`);

			///////////////////////////////////////////////////////////////////
			/// Get all posts from the previous year
			///////////////////////////////////////////////////////////////////
			const posts = await news.getNewsByDateAndCategories(dt.toISOString(), categoryIds);
			//console.log(`initApp: got posts ${JSON.stringify(posts, null, 2)}. storing posts in storage.`);

			///////////////////////////////////////////////////////////////////
			/// Cache the posts
			///////////////////////////////////////////////////////////////////
			await storage.storeNewsPosts(posts);
			console.log(`initApp: storing setupFlag: true`);

			///////////////////////////////////////////////////////////////////
			/// Load the fonts we use
			///////////////////////////////////////////////////////////////////
			await util.loadFonts();

			///////////////////////////////////////////////////////////////////
			/// Remember the app has been setup already
			///////////////////////////////////////////////////////////////////
			await storage.storeSetupFlag(true);
			console.log(`initApp: setup complete!! Yay!!`);
			return true;// indicate we did the setup process
		} catch (error) {
			console.error({errorMessage: `initApp: Error: ${util.errorMessage(error)}`});
		}
	}
}
