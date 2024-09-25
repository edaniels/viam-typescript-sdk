import type { JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { Struct } from 'google-protobuf/google/protobuf/struct_pb';
import type { GantryService } from '../../gen/component/gantry/v1/gantry_connect';
import pb from '../../gen/component/gantry/v1/gantry_pb';
import { GantryServiceClient } from '../../gen/component/gantry/v1/gantry_pb_service';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient, promisify } from '../../utils';
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
    this.client = client.createServiceClient(GantryServiceClient);
    this.name = name;
    this.options = options;
  }

  async getPosition(extra = {}) {
    const request = new pb.GetPositionRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<
      pb.GetPositionRequest,
      pb.GetPositionResponse
    >(gantryService.getPosition.bind(gantryService), request);

    return response.getPositionsMmList();
  }

  async moveToPosition(
    positionsMm: number[],
    speedsMmPerSec: number[],
    extra = {}
  ) {

    const request = new pb.MoveToPositionRequest();
    request.setName(this.name);
    request.setPositionsMmList(positionsMm);
    request.setSpeedsMmPerSecList(speedsMmPerSec);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    await promisify<pb.MoveToPositionRequest, pb.MoveToPositionResponse>(
      gantryService.moveToPosition.bind(gantryService),
      request
    );
  }

  async home(extra = {}) {
    const request = new pb.HomeRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<pb.HomeRequest, pb.HomeResponse>(
      gantryService.home.bind(gantryService),
      request
    );

    return response.getHomed();
  }

  async getLengths(extra = {}) {
    const request = new pb.GetLengthsRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<
      pb.GetLengthsRequest,
      pb.GetLengthsResponse
    >(gantryService.getLengths.bind(gantryService), request);

    return response.getLengthsMmList();
  }

  async stop(extra = {}) {
    const request = new pb.StopRequest();
    request.setName(this.name);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    await promisify<pb.StopRequest, pb.StopResponse>(
      gantryService.stop.bind(gantryService),
      request
    );
  }

  async isMoving() {
    const request = new pb.IsMovingRequest();
    request.setName(this.name);

    this.options.requestLogger?.(request);

    const response = await promisify<pb.IsMovingRequest, pb.IsMovingResponse>(
      gantryService.isMoving.bind(gantryService),
      request
    );
    return response.getIsMoving();
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
