import React from 'react';
import {AsyncStorage} from 'react-native';
import config from '../config';
import App from "../../App";

const ADMIN_LIST = "admins-list";
const AUTH_INFO = "auth-info";

export default {
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

    updateAdmin: (adminId, adminData) => {
      /// get the admin list
      /// find the one with id == adminId
      /// overwrite its data with adminData
      /// store the list again
    },
    addAdmin: (adminData) => {

    },
};