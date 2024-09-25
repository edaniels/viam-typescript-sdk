import { Struct, type JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { MotorService } from '../../gen/component/motor/v1/motor_connect';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient } from '../../utils';
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
    this.client = client.createServiceClient(MotorService);
    this.name = name;
    this.options = options;
  }

  async setPower(power: number, extra = {}) {
    const request = ({
      name: this.name,
      powerPct: power,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.setPower(request);
  }

  async goFor(rpm: number, revolutions: number, extra = {}) {
    const request = ({
      name: this.name,
      rpm,
      revolutions,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.goFor(request);
  }

  async goTo(rpm: number, positionRevolutions: number, extra = {}) {
    const request = ({
      name: this.name,
      rpm,
      positionRevolutions,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.goTo(request);
  }

  async setRPM(rpm: number, extra = {}) {
    const request = ({
      name: this.name,
      rpm,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.setRPM(request);
  }

  async resetZeroPosition(offset: number, extra = {}) {
    const request = ({
      name: this.name,
      offset,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.resetZeroPosition(request);
  }

  async stop(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.stop(request);
  }

  async getProperties(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return {
      positionReporting: ((await this.client.getProperties(request)).positionReporting),
    }
  }

  async getPosition(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getPosition(request)).position;
  }

  async isPowered(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    const response = await this.client.isPowered(request);
    return [response.isOn, response.powerPct] as const;
  }

  async isMoving() {
    const request = ({
      name: this.name,
    });

    this.options.requestLogger?.(request);

    return (await this.client.isMoving(request)).isMoving;
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
