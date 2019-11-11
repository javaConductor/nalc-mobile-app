import React from 'react';
import {AsyncStorage} from 'react-native';
import config from '../config';
import App from "../../App";

//// Storage KEYS
const ADMIN_LIST = "admins-list";
const AUTH_INFO = "auth-info";
const SELECTED_CATEGORIES = "SELECTED-CATEGORIES";

export default {
    ////////////////////
    //////// ADMIN LIST
    ////////////////////
    storeAdminList: async (adminList) => {
        AsyncStorage.setItem(ADMIN_LIST, JSON.stringify(adminList))
            .catch((e) => {
                console.error(`Error storing Admin list ${e} `);
            });
    },
    getAdminList: async () => {
        const adminListStr = await AsyncStorage.getItem(ADMIN_LIST);
        return JSON.parse(adminListStr);
    },

    ////////////////////
    ///////// AUTH INFO
    ////////////////////
    storeAuthInfo: async (authInfo) => {
        console.log(`storage.storeAuthInfo(): Storing Auth Info: ${JSON.stringify(authInfo, null, 2)} `);

        return AsyncStorage.setItem(AUTH_INFO, JSON.stringify(authInfo))
                .catch((e) => {
                    console.error(`storage.storeAuthInfo(): Error storing Auth Info: ${e} `);
                });
    },

    getAuthInfo: async () => {
        const authInfoStr = await AsyncStorage.getItem(AUTH_INFO);
        //console.log(`storage.getAuthInfo(): Auth Info String: ${authInfoStr} `);
        return JSON.parse(authInfoStr);
    },

    ///////////////////////////////
    ///////// SELECTED CATEGORIES
    //////////////////////////////
    storeSelectedCategories: async (selectedCategories) => {
        return AsyncStorage.setItem(SELECTED_CATEGORIES, JSON.stringify(selectedCategories))
            .catch((e) => {
                console.error(`storage.storeSelectedCategories(): Error storing Selected Categories ${e} `);
            });
    },

    /**
     *
     * @returns {Promise<[categoriesId, ...]>}
     */
    getSelectedCategories: async () => {
        return AsyncStorage.getItem(SELECTED_CATEGORIES)
            .then((catStr) => {
                return JSON.parse(catStr);
            })
            .catch((e) => {
                console.error(`storage.getSelectedCategories() Error getting Selected Categories: ${e} `);
                throw e;
            });
    },

    updateAdmin: (adminId, adminData) => {
      /// get the admin list
      /// find the one with id == adminId
      /// overwrite its data with adminData
      /// store the list again
    },
    addAdmin: (adminData) => {

    },
};