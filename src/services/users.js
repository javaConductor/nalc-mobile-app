import React from 'react';
import {AsyncStorage} from 'react-native';
import config from '../config';
import storage from '../services/storage';

const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;
const storeAdminsLocally = (admins) => {
  AsyncStorage.setItem()
};
export default {

    getAdmins: () => {
        return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`)
            // .then((response) => response.json())
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                storage.storeAdminList(responseJson);
                return responseJson;
            })
            .catch((error) =>{
                console.error(error);
            });
    },
    addAdmin: (adminData) => {},
    updateAdmin: (adminData) => {},
    removeAdmin: (adminId) => {},
    addAdminPhoto: (adminId, buffer) => {},
};