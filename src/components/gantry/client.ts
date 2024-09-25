import { Struct, type JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { GantryService } from '../../gen/component/gantry/v1/gantry_connect';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient } from '../../utils';
import type { Gantry } from './gantry';

/**
 * A gRPC-web client for the Gantry component.
 *
 * @group Clients
 */
export class GantryClient implements Gantry {
  private client: PromiseClient<typeof GantryService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(GantryService);
    this.name = name;
    this.options = options;
  }

  async getPosition(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getPosition(request)).positionsMm;
  }

  async moveToPosition(
    positionsMm: number[],
    speedsMmPerSec: number[],
    extra = {}
  ) {
    const request = ({
      name: this.name,
      positionsMm,
      speedsMmPerSec,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.moveToPosition(request);
  }

  async home(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.home(request)).homed;
  }

  async getLengths(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getLengths(request)).lengthsMm;
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
}
