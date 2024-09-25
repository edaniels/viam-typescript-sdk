import type { JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { Struct } from 'google-protobuf/google/protobuf/struct_pb';
import {
  GetReadingsRequest,
  GetReadingsResponse,
} from '../../gen/common/v1/common_pb';
import type { PowerSensorService } from '../../gen/component/powersensor/v1/powersensor_connect';
import pb from '../../gen/component/powersensor/v1/powersensor_pb';
import { PowerSensorServiceClient } from '../../gen/component/powersensor/v1/powersensor_pb_service';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient, promisify } from '../../utils';
import type { PowerSensor } from './power-sensor';

/**
 * A gRPC-web client for the PowerSensor component.
 *
 * @group Clients
 */

export class PowerSensorClient implements PowerSensor {
  private client: PromiseClient<typeof PowerSensorService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(PowerSensorServiceClient);
    this.name = name;
    this.options = options;
  }

  async getVoltage(extra = {}) {
    const request = new pb.GetVoltageRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<
      pb.GetVoltageRequest,
      pb.GetVoltageResponse
    >(powersensorService.getVoltage.bind(powersensorService), request);

    return [response.getVolts(), response.getIsAc()] as const;
  }

  async getCurrent(extra = {}) {
    const request = new pb.GetCurrentRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<
      pb.GetCurrentRequest,
      pb.GetCurrentResponse
    >(powersensorService.getCurrent.bind(powersensorService), request);

    return [response.getAmperes(), response.getIsAc()] as const;
  }

  async getPower(extra = {}) {
    const request = new pb.GetPowerRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<pb.GetPowerRequest, pb.GetPowerResponse>(
      powersensorService.getPower.bind(powersensorService),
      request
    );

    return response.getWatts();
  }

  async getReadings(extra = {}) {
    const request = new GetReadingsRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<GetReadingsRequest, GetReadingsResponse>(
      powersensorService.getReadings.bind(powersensorService),
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
