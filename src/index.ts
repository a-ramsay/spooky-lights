require('dotenv').config();
import * as bridge from './bridge';
import * as lights from './lights';
import * as fs from 'fs-extra';

async function run() {
   const hueBridge = await bridge.scan();
   console.log(`Found bridge: ${hueBridge.ipaddress}`);
   let rules: Rule[] = [];

   if (await fs.pathExists('rules.json')) {
      const ruleFile = await fs.readFile('rules.json');
      rules = JSON.parse(ruleFile.toString());
   }

   const allLights = await lights.listLights(hueBridge.ipaddress);
   for (const rule of rules) {
      const activeLight = allLights.filter(light => light.name === rule.name);
      if (activeLight.length !== 1) continue;
      switch (rule.command[0]) {
         case 'flicker':
         console.log(`Flickering light ${activeLight[0].name}`);
         await lights.flicker(hueBridge.ipaddress, activeLight[0]);
      }
   }
}

run().then(() => process.exit()).catch(error => {
   console.error(error);
   process.exit(1);
});

interface Rule {
   name: string;
   command: string[];
   frequency: number;
}