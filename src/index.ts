require('dotenv').config();
import * as bridge from './bridge';
import * as lights from './lights';
import * as fs from 'fs-extra';
import { getRandomInt, timeout } from './utils';
import { ILight } from 'node-hue-api';

const activeScenes: Rule[] = [];

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
      rule.bridge = hueBridge.ipaddress;
      rule.light = activeLight[0];
      activeScenes.push(rule);
   }
   await performAction();
}

run().then(() => process.exit()).catch(error => {
   console.error(error);
   process.exit(1);
});

async function performAction() {
   while (true) {
      const minFrequency = getRandomInt(100);
      console.log(`Min frequency: ${minFrequency}`);
      const choices = activeScenes.filter(scene => scene.frequency >= minFrequency);
      if (choices.length == 0) {
         await timeout(1000);
         continue;
      }
      const active = choices[getRandomInt(choices.length)];
      switch (active.command) {
         case 'flicker':
         console.log(`Flickering light ${active.light.name}`);
         await lights.flicker(active.bridge, active.light);
         break;

         case 'breathe':
         console.log(`Breathing light ${active.light.name}`);
         await lights.breathe(active.bridge, active.light);
         break;
      }
      await timeout(1000);
   }
}

interface Rule {
   name: string;
   command: string;
   frequency: number;
   bridge: string;
   light: ILight;
}