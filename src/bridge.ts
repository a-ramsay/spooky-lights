import { nupnpSearch, IUpnpSearchResultItem, HueApi } from 'node-hue-api';

let connection: HueApi = undefined;
export function scan() {
   return nupnpSearch().then(processBridges);
}

export function connect(ipaddress: string) {
   if (connection === undefined) {
      connection = new HueApi(ipaddress, process.env.HUE_USER);
   }
   return connection;
}

function processBridges(bridges: IUpnpSearchResultItem[]) {
   if (!bridges[0]) throw new Error('No hue bridge found');
   return bridges[0];
}