import { Struct, type JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { ServoService } from '../../gen/component/servo/v1/servo_connect';
import pb from '../../gen/component/servo/v1/servo_pb';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient } from '../../utils';
import type { Servo } from './servo';

/**
 * A gRPC-web client for the Servo component.
 *
 * @group Clients
 */
export class ServoClient implements Servo {
  private client: PromiseClient<typeof ServoService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(ServoService);
    this.name = name;
    this.options = options;
  }

  async move(angleDeg: number, extra = {}) {
    const request = new pb.MoveRequest({
      name: this.name,
      angleDeg,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.move(request);
  }

  async getPosition(extra = {}) {
    const request = new pb.GetPositionRequest({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getPosition(request)).positionDeg;
  }

  async stop(extra = {}) {
    const request = new pb.StopRequest({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.stop(request);
  }

  async isMoving() {
    const request = new pb.IsMovingRequest({
      name: this.name,
    });

    this.options.requestLogger?.(request);

    return (await this.client.isMoving(request)).isMoving;
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
