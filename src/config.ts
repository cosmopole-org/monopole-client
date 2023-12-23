
// settingup ####################################################

let local = false;
let GATEWAY_ADDRESS = local ? 'http://localhost:3001' : 'https://monopole.liara.run';
let AUDEIENCE = "https://dev-5dkibhg6w6hcq22l.us.auth0.com/api/v2/";
let AUTH0_DOMAIN = "dev-5dkibhg6w6hcq22l.us.auth0.com";
let AUTH0_CLIENTID = "WEnXZJhgyFhRUPrhfkBUwSlj8BbEizhi";
const publicVapidKey = "BNQ9TU-jAms67sRxUFLh6EsWGGVX6VlMB3PSSqblcUquY-QuSjkG8EZVTq0eVAf3YQoNIuynSDgPOlTEVj3_oMM";

// configuring ##################################################

const audience = AUDEIENCE && AUDEIENCE !== "YOUR_API_IDENTIFIER"
    ? AUDEIENCE
    : null;
export default {
    GATEWAY_ADDRESS,
    domain: AUTH0_DOMAIN,
    clientId: AUTH0_CLIENTID,
    publicVapidKey,
    ...(audience ? { audience } : null),
}
