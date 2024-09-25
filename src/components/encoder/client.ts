import { Struct, type JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { EncoderService } from '../../gen/component/encoder/v1/encoder_connect';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient } from '../../utils';
import { EncoderPositionType, type Encoder } from './encoder';

/**
 * A gRPC-web client for the Encoder component.
 *
 * @group Clients
 */
export class EncoderClient implements Encoder {
  private client: PromiseClient<typeof EncoderService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(EncoderService);
    this.name = name;
    this.options = options;
  }

  async resetPosition(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.resetPosition(request);
  }

  async getProperties(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return this.client.getProperties(request);
  }

  async getPosition(
    positionType: EncoderPositionType = EncoderPositionType.UNSPECIFIED,
    extra = {}
  ) {
    const request = ({
      name: this.name,
      positionType,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    const response = await this.client.getPosition(request);
    return [response.value, response.positionType] as const;
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
