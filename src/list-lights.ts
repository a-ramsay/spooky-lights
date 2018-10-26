require('dotenv').config();
import * as bridge from './bridge';
import * as lights from './lights';

async function run() {
   const hueBridge = await bridge.scan();
   console.log(`Found bridge: ${hueBridge.ipaddress}`);

   const allLights = await lights.listLights(hueBridge.ipaddress);

   allLights.map(light => {
      console.log(light.name);
   });
}

run().then(() => process.exit()).catch(error => {
   console.error(error);
   process.exit(1);
});