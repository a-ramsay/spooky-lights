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
   const originalState = await api.lightStatus(light.id);
   const brightState = lightState.create(light).transitionInstant().brightness(100);

   for (let i = 0; i < getRandomInt(4); i++) {
      await api.setLightState(light.id, brightState);
      await timeout(getRandomInt(10));
      await api.setLightState(light.id, originalState);
   }
}

export async function breathe(bridge: string, light: ILight) {
   const api = connect(bridge);
   const originalState = lightState.create(light).transition(2000);
   const newState = lightState.create(light).transition(2000).sat_inc(254);

   for (let i = 0; i < getRandomInt(4); i++) {
      await api.setLightState(light.id, newState);
      await timeout(2000);
      await api.setLightState(light.id, originalState);
      await timeout(2000);
   }
}