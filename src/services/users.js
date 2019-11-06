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
    addAdmin: (adminData) => {
        const getAdmins = this.getAdmins;
        return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...adminData, id: undefined}),
        })
            .then((resp) => {
                return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`);
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                return responseJson;
            })
            .catch((error) =>{
                console.error(error);
            });


    },

    /**
     *
     * @param adminData
     * @returns {Promise<any>}
     * TODO: Change the backend to return the new list so we don't have to refetch
     */
    updateAdmin: (adminData) => {
        const getAdmins = this.getAdmins;
        return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}/${adminData.id}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...adminData, id: undefined}),
        })
            .then((resp) => {
                return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`);
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson));
                return responseJson;
            })
            .catch((error) =>{
                console.error(error);
            });
    },
    removeAdmin: (adminId) => {
        const getAdmins = this.getAdmins;
        console.log(`removeAdmin: ${adminId}` );

        return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}/${adminId}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((resp) => {
                //console.log(JSON.stringify(resp));

                return fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`);
            })
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(JSON.stringify(responseJson));
                return responseJson;
            })
            .catch((error) =>{
                console.error(error);
                throw error;
            });
    },
    addAdminPhoto: (adminId, buffer) => {},
};