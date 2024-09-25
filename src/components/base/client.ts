import { Struct, type JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { BaseService } from '../../gen/component/base/v1/base_connect';
import type { RobotClient } from '../../robot';
import type { Options, Vector3 } from '../../types';
import { doCommandFromClient } from '../../utils';
import type { Base } from './base';

/**
 * A gRPC-web client for the Base component.
 *
 * @group Clients
 */
export class BaseClient implements Base {
  private client: PromiseClient<typeof BaseService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(BaseService);
    this.name = name;
    this.options = options;
  }

  async moveStraight(distanceMm: bigint, mmPerSec: number, extra = {}) {
    const request = ({
      name: this.name,
      mmPerSec,
      distanceMm,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.moveStraight(request);
  }

  async spin(angleDeg: number, degsPerSec: number, extra = {}) {
    const request = ({
      name: this.name,
      angleDeg,
      degsPerSec,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.spin(request);
  }

  async setPower(linear: Vector3, angular: Vector3, extra = {}) {
    const request = ({
      name: this.name,
      linear,
      angular,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.setPower(request);
  }

  async setVelocity(linear: Vector3, angular: Vector3, extra = {}) {
    const request = ({
      name: this.name,
      linear,
      angular,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.setVelocity(request);
  }

  async stop(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.stop(request);
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

  async getProperties(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return this.client.getProperties(request);
  }
}
