import React from 'react';
import config from '../config';

const backEndURL = `${config.BACKEND_PROTOCOL}://${config.BACKEND_HOST}:${config.BACKEND_PORT}`;

export default {

    check: async () => {
        try {
            const data = await fetch(`${backEndURL}/${config.BACKEND_ADMINS_PATH}`, {mode: "no-cors"});
            console.log(`check(): ${JSON.stringify(data)}`);
            return {ok: true};
        } catch (error) {
            console.log(`check(): backend unavailable.`);
            throw {ok: false, error};
        }
    },
};