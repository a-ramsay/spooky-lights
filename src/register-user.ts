import * as bridge from './bridge';

async function run() {
   const hueBridge = await bridge.scan();
   const user = await bridge.registerUser(hueBridge.ipaddress);

   console.log(`Create a .env file with HUE_USER set to: ${JSON.stringify(user)}`);
}

run().then(() => process.exit()).catch(error => {
   console.error(error);
   process.exit(1);
});