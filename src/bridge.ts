import { nupnpSearch, IUpnpSearchResultItem, HueApi } from 'node-hue-api';

let connection: HueApi = undefined;
export function scan() {
   return nupnpSearch().then(processBridges);
}

export function connect(ipaddress: string) {
   if (!process.env.HUE_USER) {
      throw new Error('HUE_USER not found in environment variables, please register with Hue bridge first.');
   }
   if (connection === undefined) {
      connection = new HueApi(ipaddress, process.env.HUE_USER);
   }
   return connection;
}

export async function checkConnection(ipaddress: string) {
   const api = connect(ipaddress);
   const config = await api.config();
   if (config.zigbeechannel) return true;
   return false;
}

export async function registerUser(ipaddress: string) {
   const hue = new HueApi();
   const user = await hue.registerUser(ipaddress, 'Spooky Lights');
   return user;
}

function processBridges(bridges: IUpnpSearchResultItem[]) {
   if (!bridges[0]) throw new Error('No hue bridge found');
   return bridges[0];
}