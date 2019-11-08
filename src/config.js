import {
    BACKEND_PROTOCOL,
    BACKEND_PORT,
    BACKEND_HOST,
    BACKEND_ADMINS_PATH,
    BACKEND_AUTH_PATH,
    BACKEND_CATEGORIES_PATH,
    USER_KEY
} from 'react-native-dotenv';

const cfg = {BACKEND_PROTOCOL,
    BACKEND_PORT, BACKEND_HOST,
    BACKEND_ADMINS_PATH,
    BACKEND_CATEGORIES_PATH,
    BACKEND_AUTH_PATH,
    USER_KEY};
console.log(`config:${JSON.stringify(cfg)}`);

export default cfg;
