import { connect } from './bridge';
import { ILight, lightState } from 'node-hue-api';
import { timeout, getRandomInt } from './utils';

export async function listLights(bridge: string) {
   const api = connect(bridge);

   const allLights = await api.lights();
   const rgbLights = allLights.lights.filter(light => light.type == 'Extended color light');
   return rgbLights;
}

export async function flicker(bridge: string, light: ILight) {
   const api = connect(bridge);
   const brightness = getRandomInt(2) === 1 ? 100 : 0;
   const thisLight = await api.lightStatus(light.id);
   const originalState = lightState.create().transitionInstant().bri(thisLight.state.bri);
   const brightState = lightState.create().transitionInstant().bri_inc(254);

   const times = getRandomInt(4) + 1;
   for (let i = 0; i < times; i++) {
      await api.setLightState(light.id, brightState);
      await api.setLightState(light.id, originalState);
   }
}

export async function breathe(bridge: string, light: ILight) {
   const api = connect(bridge);
   const thisLight = await api.lightStatus(light.id);
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