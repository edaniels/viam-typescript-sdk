import type { RobotClient } from '../../robot';
import type { Options } from '../../types';

import type { JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import type { BoardService } from '../../gen/component/board/v1/board_connect';
import pb from '../../gen/component/board/v1/board_pb';
import { doCommandFromClient } from '../../utils';
import type { Board, Duration, PowerMode, Tick } from './board';

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
    this.client = client.createServiceClient(BoardServiceClient);
    this.name = name;
    this.options = options;
  }

  async setGPIO(pin: string, high: boolean, extra = {}) {
    const request = new pb.SetGPIORequest({
      name: this.name,
      pin,
      high,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await promisify<pb.SetGPIORequest, pb.SetGPIOResponse>(
      boardService.setGPIO.bind(boardService),
      request
    );
  }

  async getGPIO(pin: string, extra = {}) {
    const request = new pb.GetGPIORequest({
      name: this.name,
      pin,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    const response = await promisify<pb.GetGPIORequest, pb.GetGPIOResponse>(
      boardService.getGPIO.bind(boardService),
      request
    );
    return response.getHigh();
  }

  async getPWM(pin: string, extra = {}) {
    const request = new pb.PWMRequest({
      name: this.name,
      pin,
      extra: new Struct(extra),
    });
    request.setName(this.name);
    request.setPin(pin);
    request.setExtra(Struct.fromJavaScript(extra));

    this.options.requestLogger?.(request);

    const response = await promisify<pb.PWMRequest, pb.PWMResponse>(
      boardService.pWM.bind(boardService),
      request
    );
    return response.getDutyCyclePct();
  }

  async setPWM(pin: string, dutyCyle: number, extra = {}) {
    const request = new pb.SetPWMRequest({
      name: this.name,
      pin,
      dutyCyclePct: dutyCyle,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await promisify<pb.SetPWMRequest, pb.SetPWMResponse>(
      boardService.setPWM.bind(boardService),
      request
    );
  }

  async getPWMFrequency(pin: string, extra = {}) {
    const request = new pb.PWMFrequencyRequest({
      name: this.name,
      pin,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    const response = await promisify<
      pb.PWMFrequencyRequest,
      pb.PWMFrequencyResponse
    >(boardService.pWMFrequency.bind(boardService), request);
    return response.getFrequencyHz();
  }

  async setPWMFrequency(pin: string, frequencyHz: bigint, extra = {}) {
    const request = new pb.SetPWMFrequencyRequest({
      name: this.name,
      pin,
      frequencyHz,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await promisify<pb.SetPWMFrequencyRequest, pb.SetPWMFrequencyResponse>(
      boardService.setPWMFrequency.bind(boardService),
      request
    );
  }

  async readAnalogReader(analogReader: string, extra = {}) {
    const request = new pb.ReadAnalogReaderRequest({
      boardName: this.name,
      analogReaderName: analogReader,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    const response = await promisify<
      pb.ReadAnalogReaderRequest,
      pb.ReadAnalogReaderResponse
    >(boardService.readAnalogReader.bind(boardService), request);

    return response.toObject();
  }

  async writeAnalog(pin: string, value: number, extra = {}) {
    const request = new pb.WriteAnalogRequest({
      name: this.name,
      pin,
      value,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await promisify<pb.WriteAnalogRequest, pb.WriteAnalogResponse>(
      boardService.writeAnalog.bind(boardService),
      request
    );
  }

  async getDigitalInterruptValue(digitalInterruptName: string, extra = {}) {
    const request = new pb.GetDigitalInterruptValueRequest({
      boardName: this.name,
      digitalInterruptName,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    const response = await promisify<
      pb.GetDigitalInterruptValueRequest,
      pb.GetDigitalInterruptValueResponse
    >(boardService.getDigitalInterruptValue.bind(boardService), request);
    return response.getValue();
  }

  async streamTicks(interrupts: string[], queue: Tick[], extra = {}) {
    const request = new pb.StreamTicksRequest();
    request.setName(this.name);
    request.setPinNamesList(interrupts);
    request.setExtra(Struct.fromJavaScript(extra));
    this.options.requestLogger?.(request);
    const stream = this.client.streamTicks(request);
    stream.on('data', (response) => {
      const tick: Tick = {
        pinName: response.getPinName(),
        high: response.getHigh(),
        time: response.getTime(),
      };
      queue.push(tick);
    });

    return new Promise<void>((resolve, reject) => {
      stream.on('status', (status) => {
        if (status.code !== 0) {
          const error = {
            message: status.details,
            code: status.code,
            metadata: status.metadata,
          };
          reject(error);
        }
      });
      stream.on('end', (end) => {
        if (end === undefined) {
          const error = { message: 'Stream ended without a status code' };
          reject(error);
        } else if (end.code !== 0) {
          const error = {
            message: end.details,
            code: end.code,
            metadata: end.metadata,
          };
          reject(error);
        }
        resolve();
      });
    });
  }

  async setPowerMode(
    name: string,
    powerMode: PowerMode,
    duration?: Duration,
    extra = {}
  ) {
    const request = new pb.SetPowerModeRequest({
      name: this.name,
      powerMode,
      extra: new Struct(extra),
    });
    if (duration) {
      const pbDuration = new PBDuration();
      pbDuration.setNanos(duration.nanos);
      pbDuration.setSeconds(duration.seconds);
      request.duration = pbDuration;
    }

    this.options.requestLogger?.(request);

    await promisify<pb.SetPowerModeRequest, pb.SetPowerModeResponse>(
      boardService.setPowerMode.bind(boardService),
      request
    );
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
