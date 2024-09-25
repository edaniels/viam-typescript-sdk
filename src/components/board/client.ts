import type { RobotClient } from '../../robot';
import type { Options } from '../../types';

import { Duration, Struct, type JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { BoardService } from '../../gen/component/board/v1/board_connect';
import { doCommandFromClient } from '../../utils';
import { type Board, type PowerMode, type Tick } from './board';

/**
 * A gRPC-web client for the Board component.
 *
 * @group Clients
 */
export class BoardClient implements Board {
  private client: PromiseClient<typeof BoardService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(BoardService);
    this.name = name;
    this.options = options;
  }

  async setGPIO(pin: string, high: boolean, extra = {}) {
    const request = ({
      name: this.name,
      pin,
      high,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.setGPIO(request);
  }

  async getGPIO(pin: string, extra = {}) {
    const request = ({
      name: this.name,
      pin,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getGPIO(request)).high;
  }

  async getPWM(pin: string, extra = {}) {
    const request = ({
      name: this.name,
      pin,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.pWM(request)).dutyCyclePct;
  }

  async setPWM(pin: string, dutyCyle: number, extra = {}) {
    const request = ({
      name: this.name,
      pin,
      dutyCyclePct: dutyCyle,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.setPWM(request);
  }

  async getPWMFrequency(pin: string, extra = {}) {
    const request = ({
      name: this.name,
      pin,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.pWMFrequency(request)).frequencyHz;
  }

  async setPWMFrequency(pin: string, frequencyHz: bigint, extra = {}) {
    const request = ({
      name: this.name,
      pin,
      frequencyHz,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.setPWMFrequency(request);
  }

  async readAnalogReader(analogReader: string, extra = {}) {
    const request = ({
      boardName: this.name,
      analogReaderName: analogReader,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return this.client.readAnalogReader(request);
  }

  async writeAnalog(pin: string, value: number, extra = {}) {
    const request = ({
      name: this.name,
      pin,
      value,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.writeAnalog(request);
  }

  async getDigitalInterruptValue(digitalInterruptName: string, extra = {}) {
    const request = ({
      boardName: this.name,
      digitalInterruptName,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getDigitalInterruptValue(request)).value;
  }

  async streamTicks(interrupts: string[], queue: Tick[], extra = {}) {
    const request = ({
      name: this.name,
      pinNames: interrupts,
      extra: new Struct(extra),
    });
    this.options.requestLogger?.(request);
    const stream = this.client.streamTicks(request);

    for await (const tick of stream) {
      queue.push({
        pinName: tick.pinName,
        high: tick.high,
        time: tick.time,
      });
    }
  }

  async setPowerMode(
    powerMode: PowerMode,
    duration?: Duration,
    extra = {}
  ) {
    const request = ({
      name: this.name,
      powerMode,
      duration,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.setPowerMode(request);
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
