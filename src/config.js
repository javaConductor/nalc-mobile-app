import {
    BACKEND_ADMINS_PATH,
    BACKEND_AUTH_PATH,
    BACKEND_CATEGORIES_PATH,
    BACKEND_HOST,
    BACKEND_NEWS_PATH,
    BACKEND_PORT,
    BACKEND_PROTOCOL,
    NEWS_CHECK_INTERVAL_SECONDS,
    USER_KEY
} from 'react-native-dotenv';

const cfg = {
    BACKEND_PROTOCOL,
    BACKEND_PORT, BACKEND_HOST,
    BACKEND_ADMINS_PATH,
    BACKEND_CATEGORIES_PATH,
    BACKEND_NEWS_PATH,
    BACKEND_AUTH_PATH,
    NEWS_CHECK_INTERVAL_SECONDS,
    USER_KEY
};
console.log(`config:${JSON.stringify(cfg, null, 2)}`);

export default cfg;
