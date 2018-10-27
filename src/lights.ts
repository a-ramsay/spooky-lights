import { connect } from './bridge';
import { ILight, lightState } from 'node-hue-api';
import { timeout, getRandomInt } from './utils';

export async function listLights(bridge: string) {
   const api = connect(bridge);

   const allLights = await api.lights();
   return allLights.lights;
}

export async function flicker(bridge: string, light: ILight) {
   const api = connect(bridge);
   let brightness = getRandomInt(2) === 1 ? 254 : -254;
   const thisLight = await api.lightStatus(light.id);
   if (!thisLight.state.on) return;
   if (thisLight.state.bri > 204) brightness = -254;
   const originalState = lightState.create().transitionInstant().bri(thisLight.state.bri);
   const brightState = lightState.create().transitionInstant().bri_inc(brightness);

   const times = getRandomInt(4) + 1;
   for (let i = 0; i < times; i++) {
      await api.setLightState(light.id, brightState);
      await api.setLightState(light.id, originalState);
   }
}

export async function breathe(bridge: string, light: ILight) {
   const api = connect(bridge);
   const thisLight = await api.lightStatus(light.id);
   if (!thisLight.state.on) return;
   const satChange = thisLight.state.sat + 64 > 254 ? -64 : 64;
   const originalState = lightState.create().transition(1800).sat(thisLight.state.sat);
   const newState = lightState.create().transition(1800).sat_inc(satChange);

   const times = getRandomInt(4) + 1;
   for (let i = 0; i < times; i++) {
      await api.setLightState(light.id, newState);
      await timeout(2000);
      await api.setLightState(light.id, originalState);
      await timeout(2000);
   }
}