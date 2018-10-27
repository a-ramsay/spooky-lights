require('dotenv').config();
import * as bridge from './bridge';
import * as lights from './lights';
import { isRGB } from './utils';

export async function run() {
   const hueBridge = await bridge.scan();
   console.log(`Found bridge: ${hueBridge.ipaddress}`);

   const allLights = await lights.listLights(hueBridge.ipaddress);

   allLights.map(light => {
      if (isRGB(light.type)) {
         console.log(light.name);
      } else {
         console.log(`${light.name} (flicker only)`);
      }
   });
}