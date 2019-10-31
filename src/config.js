const yaml = require('js-yaml');
const fs = require('fs');
const process = require('process');

console.log("config.js");
let config=null;
try {
    config = yaml.safeLoad(fs.readFileSync('nalc-mobile.yaml', 'utf8'));
    // const indentedJson = JSON.stringify(config, null, 4);
    // console.log(indentedJson);
} catch (e) {
    console.log(e);
    //process.exit(1);
}
module.exports=config;