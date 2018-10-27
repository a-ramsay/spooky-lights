import * as bridge from './bridge';

export async function run() {
   const hueBridge = await bridge.scan();
   const user = await bridge.registerUser(hueBridge.ipaddress);

   console.log(`Create a .env file with HUE_USER set to: ${JSON.stringify(user)}`);
}