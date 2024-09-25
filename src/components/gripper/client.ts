import type { JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { Struct } from 'google-protobuf/google/protobuf/struct_pb';
import type { GripperService } from '../../gen/component/gripper/v1/gripper_connect';
import pb from '../../gen/component/gripper/v1/gripper_pb';
import { GripperServiceClient } from '../../gen/component/gripper/v1/gripper_pb_service';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient, promisify } from '../../utils';
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
    this.client = client.createServiceClient(GripperServiceClient);
    this.name = name;
    this.options = options;
  }

  async open(extra = {}) {
    const request = new pb.OpenRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    await promisify<pb.OpenRequest, pb.OpenResponse>(
      service.open.bind(service),
      request
    );
  }

  async grab(extra = {}) {
    const request = new pb.GrabRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    await promisify<pb.GrabRequest, pb.GrabResponse>(
      service.grab.bind(service),
      request
    );
  }

  async stop(extra = {}) {
    const request = new pb.StopRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    await promisify<pb.StopRequest, pb.StopResponse>(
      service.stop.bind(service),
      request
    );
  }

  async isMoving() {
    const request = new pb.IsMovingRequest();
    request.setName(this.name);

    this.options.requestLogger?.(request);

    const response = await promisify<pb.IsMovingRequest, pb.IsMovingResponse>(
      service.isMoving.bind(service),
      request
    );

    return response.getIsMoving();
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
