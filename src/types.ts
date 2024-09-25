import type { JsonValue, Struct } from '@bufbuild/protobuf';
import common from './gen/common/v1/common_pb';

export interface Options {
  requestLogger?: (req: unknown) => void;
}

export interface Resource {
  /**
   * Send/Receive arbitrary commands to the resource.
   *
   * @param command - The command to execute.
   */
  doCommand(command: Struct): Promise<JsonValue>;
}

// Common Protobuf Types

export type ResourceName = common.ResourceName;
export type GeoGeometry = common.GeoGeometry;
export type GeoPoint = common.GeoPoint;

export const isValidGeoPoint = (value: GeoPoint) => {
  const { latitude, longitude } = value;

  return !(
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  );
};

// Spatial Math
export type Vector3 = common.Vector3;
export type Orientation = common.Orientation;

// Motion
export type Pose = common.Pose;
export type PoseInFrame = common.PoseInFrame;
export type Transform = common.Transform;
export type WorldState = common.WorldState;
export type GeometriesInFrame = common.GeometriesInFrame;
export type Geometry = common.Geometry;
export type Sphere = common.Sphere;
export type RectangularPrism = common.RectangularPrism;
export type Capsule = common.Capsule;
