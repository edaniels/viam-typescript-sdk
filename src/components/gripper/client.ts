import { Struct, type JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { GripperService } from '../../gen/component/gripper/v1/gripper_connect';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient } from '../../utils';
import type { Gripper } from './gripper';

/**
 * A gRPC-web client for the Gripper component.
 *
 * @group Clients
 */
export class GripperClient implements Gripper {
  private client: PromiseClient<typeof GripperService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(GripperService);
    this.name = name;
    this.options = options;
  }

  async open(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.open(request);
  }

  async grab(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.grab(request);
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
