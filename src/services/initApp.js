import storage from './storage';
import categoryService from './categories';
import news from './news';
import util from "./util";


export default {

	initApp: async () => {

		/// check storage for setupDone flag
		/// if none
		///     get the categories and select all of them
		//      load the last year's
		///     set the last loaded date for today
		try {
			console.log(`initApp: getting setupFlag from storage.`);

			const setupFlag = await storage.getSetupFlag();
			console.log(`initApp: checking setupFlag: ${setupFlag}`);
			if (setupFlag)
				return false; // indicate we did NOT do the setup process
			console.log(`initApp: setupFlag must be falsy: getting categories.`);
			const categories = await categoryService.getCategories();
			console.log(`initApp: got categories ${JSON.stringify(categories)}`);
			const userInterests = categories.map((category) => (category.id));
			console.log(`initApp: userInterests list: ${JSON.stringify(userInterests)}. Storing in storage.`);
			await storage.storeSelectedCategories(userInterests);

			const dt = new Date();
			dt.setFullYear(dt.getFullYear() - 1);
			const categoryIds = categories.map(cat => cat.id);
			console.log(`initApp: getting posts from ${dt.toString()} with categories ${JSON.stringify(categoryIds)}.`);
			const posts = await news.getNewsByDateAndCategories(dt.toISOString(), categoryIds);
			console.log(`initApp: got posts ${JSON.stringify(posts, null, 2)}. storing posts in storage.`);
			await storage.storeNewsPosts(posts);
			console.log(`initApp: storing setupFlag: true`);
			await storage.storeSetupFlag(true);
			console.log(`initApp: setup complete!! Yay!!`);
			return true;// indicate we did the setup process
		} catch (error) {
			console.error(`initApp: Error: ${util.errorMessage(error)}`);
		}
	}
}