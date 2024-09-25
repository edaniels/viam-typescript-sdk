import type { RobotClient } from '../../robot';
import type { Options } from '../../types';

import { Struct, type JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { SensorService } from '../../gen/component/sensor/v1/sensor_connect';
import { doCommandFromClient } from '../../utils';
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
    this.client = client.createServiceClient(SensorService);
    this.name = name;
    this.options = options;
  }

  async getReadings(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    const response = await this.client.getReadings(request);

    const result: Record<string, JsonValue> = {};
    for (const key of Object.keys(response.readings)) {
      const value = response.readings[key];
      if (!value) {
        continue;
      }
      result[key] = value.toJson();
    }
    return result;
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
