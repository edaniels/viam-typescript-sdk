import type { JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { Struct } from 'google-protobuf/google/protobuf/struct_pb';
import type { MotorService } from '../../gen/component/motor/v1/motor_connect';
import motorApi from '../../gen/component/motor/v1/motor_pb';
import { MotorServiceClient } from '../../gen/component/motor/v1/motor_pb_service';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient, promisify } from '../../utils';
import type { Motor } from './motor';

/**
 * A gRPC-web client for the Motor component.
 *
 * @group Clients
 */
export class MotorClient implements Motor {
  private client: PromiseClient<typeof MotorService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(MotorServiceClient);
    this.name = name;
    this.options = options;
  }

  async setPower(power: number, extra = {}) {
    const request = new motorApi.SetPowerRequest();
    request.setName(this.name);
    request.setPowerPct(power);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    await promisify<motorApi.SetPowerRequest, motorApi.SetPowerResponse>(
      motorService.setPower.bind(motorService),
      request
    );
  }

  async goFor(rpm: number, revolutions: number, extra = {}) {
    const request = new motorApi.GoForRequest();
    request.setName(this.name);
    request.setRpm(rpm);
    request.setRevolutions(revolutions);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    await promisify<motorApi.GoForRequest, motorApi.GoForResponse>(
      motorService.goFor.bind(motorService),
      request
    );
  }

  async goTo(rpm: number, positionRevolutions: number, extra = {}) {
    const request = new motorApi.GoToRequest();
    request.setName(this.name);
    request.setRpm(rpm);
    request.setPositionRevolutions(positionRevolutions);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    await promisify<motorApi.GoToRequest, motorApi.GoToResponse>(
      motorService.goTo.bind(motorService),
      request
    );
  }

  async setRPM(rpm: number, extra = {}) {
    const request = new motorApi.SetRPMRequest();
    request.setName(this.name);
    request.setRpm(rpm);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    await promisify<motorApi.SetRPMRequest, motorApi.SetRPMResponse>(
      motorService.setRPM.bind(motorService),
      request
    );
  }

  async resetZeroPosition(offset: number, extra = {}) {
    const request = new motorApi.ResetZeroPositionRequest();
    request.setName(this.name);
    request.setOffset(offset);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    await promisify<
      motorApi.ResetZeroPositionRequest,
      motorApi.ResetZeroPositionResponse
    >(motorService.resetZeroPosition.bind(motorService), request);
  }

  async stop(extra = {}) {
    const request = new motorApi.StopRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    await promisify<motorApi.StopRequest, motorApi.StopResponse>(
      motorService.stop.bind(motorService),
      request
    );
  }

  async getProperties(extra = {}) {
    const request = new motorApi.GetPropertiesRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<
      motorApi.GetPropertiesRequest,
      motorApi.GetPropertiesResponse
    >(motorService.getProperties.bind(motorService), request);
    return { positionReporting: response.getPositionReporting() };
  }

  async getPosition(extra = {}) {
    const request = new motorApi.GetPositionRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<
      motorApi.GetPositionRequest,
      motorApi.GetPositionResponse
    >(motorService.getPosition.bind(motorService), request);
    return response.getPosition();
  }

  async isPowered(extra = {}) {
    const request = new motorApi.IsPoweredRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<
      motorApi.IsPoweredRequest,
      motorApi.IsPoweredResponse
    >(motorService.isPowered.bind(motorService), request);
    return [response.getIsOn(), response.getPowerPct()] as const;
  }

  async isMoving() {
    const request = new motorApi.IsMovingRequest();
    request.setName(this.name);

    this.options.requestLogger?.(request);

    const response = await promisify<
      motorApi.IsMovingRequest,
      motorApi.IsMovingResponse
    >(motorService.isMoving.bind(motorService), request);
    return response.getIsMoving();
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
