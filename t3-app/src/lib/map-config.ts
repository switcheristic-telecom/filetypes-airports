import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core/typed";

import type { TransitionInterpolator } from "deck.gl/typed";
import easingsFunctions from "@/utils/easing";
import type { MapViewState as _MapViewState } from "deck.gl/typed";

export interface MapViewState extends _MapViewState {
  numberOfMutations: number;
}

export const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 3.0,
});

export const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 1,
  position: [-0.144528, 49.739968, 80000],
});

export const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000],
});

export const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
  pointLight2,
});

export const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51],
};

export const INITIAL_VIEW_STATE: MapViewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 6,
  // zoom: 13,
  minZoom: 2,
  maxZoom: 7,
  // maxZoom: 20,
  pitch: 0,
  bearing: 0,
  transitionEasing: easingsFunctions.easeInOutQuad,
  numberOfMutations: 0,
};

export const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];
