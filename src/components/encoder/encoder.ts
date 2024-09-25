import type { Struct } from '@bufbuild/protobuf';
import type { Resource } from '../../types';

import type {
  GetPropertiesResponse as EncoderProperties
} from '../../gen/component/encoder/v1/encoder_pb';

import {
  PositionType as EncoderPositionType
} from '../../gen/component/encoder/v1/encoder_pb';





/** Represents a physical encoder. */
export interface Encoder extends Resource {
  /** Set the current position of the encoder as the new zero position. */
  resetPosition(extra?: Struct): Promise<void>;

  /** Return the encoder's properties. */
  getProperties(extra?: Struct): Promise<EncoderProperties>;

  /**
   * Return the current position either in relative units (ticks away from a
   * zero position) or absolute units (degrees along a circle).
   *
   * @param positionType - The type of position the encoder returns (ticks or
   *   degrees)
   */
  getPosition(
    positionType?: EncoderPositionType,
    extra?: Struct
  ): Promise<readonly [number, EncoderPositionType]>;
}

export {PositionType as EncoderPositionType, type GetPropertiesResponse as EncoderProperties} from '../../gen/component/encoder/v1/encoder_pb';