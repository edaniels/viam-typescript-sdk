import type { JsonValue, Struct } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import type { GenericService } from '../../gen/component/generic/v1/generic_connect';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient } from '../../utils';
import type { Generic } from './generic';

/**
 * A gRPC-web client for the Generic component.
 *
 * @group Clients
 */
export class GenericClient implements Generic {
  private client: PromiseClient<typeof GenericService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(GenericServiceClient);
    this.name = name;
    this.options = options;
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
