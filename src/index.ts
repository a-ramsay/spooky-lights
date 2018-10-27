#!/usr/bin/env node

require('dotenv').config();
import * as bridge from './bridge';
import * as lights from './lights';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';
import { getRandomInt, timeout, isRGB } from './utils';
import { ILight } from 'node-hue-api';
import * as listLights from './list-lights';
import * as registerUser from './register-user';

const activeScenes: Rule[] = [];

const choices = [
   'run',
   'list-lights',
   'register-user',
   'check-random'
];
const prompt = [
   {
      type: "list",
      name: "command",
      message: "Choose command",
      default: "run",
      choices: choices
   },
   {
      type: "confirm",
      name: "hueButton",
      message: "Press the link button on your Hue bridge",
      when: (response: any) => {
         return response.command == 'register-user';
      }
   }
];
inquirer.prompt<{ command: string, hueButton?: boolean }>(prompt).then(choice => {
   switch (choice.command) {
      case 'run':
      run().then(() => process.exit()).catch(error => {
         console.error(error);
         process.exit(1);
      });
      break;

      case 'list-lights':
      listLights.run().then(() => process.exit()).catch(error => {
         console.error(error);
         process.exit(1);
      });
      break;

      case 'register-user':
      if (choice.hueButton) {
         registerUser.run().then(() => process.exit()).catch(error => {
            console.error(error);
            process.exit(1);
         });
      } else {
         console.log('Exiting');
         process.exit();
      }
      break;

      case 'check-random':
      for (let i = 0; i < 100; i++) {
         console.log(getRandomInt(2));
      }
      break;
   }
});

async function run() {
   const hueBridge = await bridge.scan();
   console.log(`Found bridge: ${hueBridge.ipaddress}`);
   console.log('Checking connection...');
   const connectionSuccessful = await bridge.checkConnection(hueBridge.ipaddress);
   if (!connectionSuccessful) {
      throw new Error('Error connecting to bridge, have you registered this app with the bridge?');
   }
   console.log('Connection successful');
   let rules: Rule[] = [];

   if (await fs.pathExists('rules.json')) {
      const ruleFile = await fs.readFile('rules.json');
      rules = JSON.parse(ruleFile.toString());
   }

   const allLights = await lights.listLights(hueBridge.ipaddress);
   for (const rule of rules) {
      const activeLight = allLights.filter(light => light.name === rule.name);
      if (activeLight.length !== 1) continue;
      if (rule.command == 'breathe' && !isRGB(activeLight[0].type)) continue;
      rule.bridge = hueBridge.ipaddress;
      rule.light = activeLight[0];
      activeScenes.push(rule);
   }
   await performAction();
}

async function performAction() {
   while (true) {
      const minFrequency = getRandomInt(100);
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