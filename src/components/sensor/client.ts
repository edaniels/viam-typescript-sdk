import { Struct } from 'google-protobuf/google/protobuf/struct_pb';

import { SensorServiceClient } from '../../gen/component/sensor/v1/sensor_pb_service';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';

import type { JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import {
  GetReadingsRequest,
  GetReadingsResponse,
} from '../../gen/common/v1/common_pb';
import type { SensorService } from '../../gen/component/sensor/v1/sensor_connect';
import { doCommandFromClient, promisify } from '../../utils';
import type { Sensor } from './sensor';

/**
 * A gRPC-web client for the Sensor component.
 *
 * @group Clients
 */
export class SensorClient implements Sensor {
  private client: PromiseClient<typeof SensorService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(SensorServiceClient);
    this.name = name;
    this.options = options;
  }

  async getReadings(extra = {}) {
    const request = new GetReadingsRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<GetReadingsRequest, GetReadingsResponse>(
      sensorService.getReadings.bind(sensorService),
      request
    );

    const result: Record<string, unknown> = {};
    for (const [key, value] of response.getReadingsMap().entries()) {
      result[key] = value.toJavaScript();
    }
    return result;
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
