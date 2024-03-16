import {
  IconLayer,
  type IconLayerProps,
  project32,
  picking,
  type Accessor,
} from "deck.gl/typed";
import { _mergeShaders } from "@deck.gl/core/typed";

type SpinningIconLayerProps<DataT = unknown> = IconLayerProps<DataT> & {
  getYAngle?: Accessor<DataT, number>;
  collisionEnabled?: boolean;
  collisionTestProps: unknown;
  getCollisionPriority: unknown;
  extensions: unknown[];
};

export class SpinningIconLayer<DataT = unknown> extends IconLayer<
  DataT,
  SpinningIconLayerProps<DataT>
> {
  getShaders() {
    let shaders = {};
    for (const extension of this.props.extensions) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      shaders = _mergeShaders(
        { vs, fs, modules: [project32, picking] },
        extension.getShaders.call(this, extension),
      );
    }
    return shaders;
  }
  initializeState(): void {
    super.initializeState();
    const attributeManager = this.getAttributeManager();
    attributeManager!.addInstanced({
      instanceYAngles: { size: 1, accessor: "getYAngle", transition: true },
    });
  }
}

const vs = `\
#define SHADER_NAME icon-layer-vertex-shader

attribute vec2 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceSizes;
attribute float instanceAngles;
attribute vec4 instanceColors;
attribute vec3 instancePickingColors;
attribute vec4 instanceIconFrames;
attribute float instanceColorModes;
attribute vec2 instanceOffsets;
attribute vec2 instancePixelOffset;

uniform float sizeScale;
uniform vec2 iconsTextureDim;
uniform float sizeMinPixels;
uniform float sizeMaxPixels;
uniform bool billboard;
uniform int sizeUnits;

varying float vColorMode;
varying vec4 vColor;
varying vec2 vTextureCoords;
varying vec2 uv;

attribute float instanceYAngles;


vec2 rotate_by_angle(vec2 vertex, float angle) {
  float angle_radian = angle * PI / 180.0;
  float cos_angle = cos(angle_radian);
  float sin_angle = sin(angle_radian);
  mat2 rotationMatrix = mat2(cos_angle, -sin_angle, sin_angle, cos_angle);
  return rotationMatrix * vertex;
}

vec3 rotateY(vec3 v, float angle) {
  float angle_radian = angle * PI / 180.0;
  float sinA = sin(angle_radian);
  float cosA = cos(angle_radian);
  return vec3(v.x * cosA - v.z * sinA, v.y, v.x * sinA + v.z * cosA);
}



void main(void) {
  geometry.worldPosition = instancePositions;
  geometry.uv = positions;
  geometry.pickingColor = instancePickingColors;
  uv = positions;

  vec3 position3D = vec3(positions, 0.0);
  vec3 rotatedPosition = rotateY(position3D, instanceYAngles);
  
  vec2 iconSize = instanceIconFrames.zw;
  // convert size in meters to pixels, then scaled and clamp
 
  // project meters to pixels and clamp to limits 
  float sizePixels = clamp(
    project_size_to_pixel(instanceSizes * sizeScale, sizeUnits), 
    sizeMinPixels, sizeMaxPixels
  );

  // scale icon height to match instanceSize
  float instanceScale = iconSize.y == 0.0 ? 0.0 : sizePixels / iconSize.y;

  // scale and rotate vertex in "pixel" value and convert back to fraction in clipspace
  vec2 pixelOffset = rotatedPosition.xy / 2.0 * iconSize + instanceOffsets;
  pixelOffset = rotate_by_angle(pixelOffset, instanceAngles) * instanceScale;
  pixelOffset += instancePixelOffset;
  pixelOffset.y *= -1.0;


  if (billboard)  {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
    vec3 offset = vec3(pixelOffset, 0.0);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);

  } else {
    vec3 offset_common = vec3(project_pixel_size(pixelOffset), 0.0);
    DECKGL_FILTER_SIZE(offset_common, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset_common, geometry.position); 
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  }

  vTextureCoords = mix(
    instanceIconFrames.xy,
    instanceIconFrames.xy + iconSize,
    (positions.xy + 1.0) / 2.0
  ) / iconsTextureDim;

  vColor = instanceColors;
  DECKGL_FILTER_COLOR(vColor, geometry);

  vColorMode = instanceColorModes;
}
`;

const fs = `\
#define SHADER_NAME icon-layer-fragment-shader

precision highp float;

uniform float opacity;
uniform sampler2D iconsTexture;
uniform float alphaCutoff;

varying float vColorMode;
varying vec4 vColor;
varying vec2 vTextureCoords;
varying vec2 uv;

void main(void) {
  geometry.uv = uv;

  vec4 texColor = texture2D(iconsTexture, vTextureCoords);

  // if colorMode == 0, use pixel color from the texture
  // if colorMode == 1 or rendering picking buffer, use texture as transparency mask
  vec3 color = mix(texColor.rgb, vColor.rgb, vColorMode);
  // Take the global opacity and the alpha from vColor into account for the alpha component
  float a = texColor.a * opacity * vColor.a;

  if (a < alphaCutoff) {
    discard;
  }

  gl_FragColor = vec4(color, a);
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`;
