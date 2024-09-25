import type { JsonValue, Struct } from '@bufbuild/protobuf';
import type { GeoPoint } from './gen/common/v1/common_pb';

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

export type {
  Capsule,
  GeoGeometry,
  GeoPoint,
  GeometriesInFrame,
  Geometry,
  Orientation,
  Pose,
  PoseInFrame,
  RectangularPrism, ResourceName, Sphere, Transform,
  Vector3,
  WorldState
} from './gen/common/v1/common_pb';

export const isValidGeoPoint = (value: GeoPoint) => {
  const { latitude, longitude } = value;

  return !(
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  );
};
