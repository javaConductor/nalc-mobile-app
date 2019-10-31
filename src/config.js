import { BACKEND_PROTOCOL,
 BACKEND_PORT,
 BACKEND_HOST,
 BACKEND_ADMINS_PATH,
 USER_KEY } from 'react-native-dotenv';

const cfg =   {BACKEND_PROTOCOL, BACKEND_PORT,BACKEND_HOST, BACKEND_ADMINS_PATH, USER_KEY};
console.log(`config:${JSON.stringify(cfg) }`);

export default  cfg;
