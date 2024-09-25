import { Struct, type JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { VisionService } from '../../gen/service/vision/v1/vision_connect';
import { GetClassificationsFromCameraRequest, GetClassificationsRequest } from '../../gen/service/vision/v1/vision_pb';
import type { MimeType } from '../../main';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient } from '../../utils';
import type { CaptureAllOptions } from './types';
import type { Vision } from './vision';

/**
 * A gRPC-web client for a Vision service.
 *
 * @group Clients
 */
export class VisionClient implements Vision {
  private client: PromiseClient<typeof VisionService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(VisionService);
    this.name = name;
    this.options = options;
  }

  async getDetectionsFromCamera(cameraName: string, extra = {}) {
    const request = ({
      name: this.name,
      cameraName,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getDetectionsFromCamera(request)).detections;
  }

  async getDetections(
    image: Uint8Array,
    width: bigint,
    height: bigint,
    mimeType: MimeType,
    extra = {}
  ) {
    const request = ({
      name: this.name,
      image,
      width,
      height,
      mimeType,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getDetections(request)).detections;
  }

  async getClassificationsFromCamera(
    cameraName: string,
    count: number,
    extra = {}
  ) {
    const request = new GetClassificationsFromCameraRequest({
      name: this.name,
      cameraName,
      n: count,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getClassificationsFromCamera(request)).classifications;
  }

  async getClassifications(
    image: Uint8Array,
    width: number,
    height: number,
    mimeType: MimeType,
    count: number,
    extra = {}
  ) {
    const request = new GetClassificationsRequest({
      name: this.name,
      image,
      width,
      height,
      mimeType,
      n: count,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getClassifications(request)).classifications;
  }

  async getObjectPointClouds(cameraName: string, extra = {}) {
    const request = ({
      name: this.name,
      cameraName,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getObjectPointClouds(request)).objects;
  }

  async getProperties(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    const response = await this.client.getProperties(request);
    return {
      classificationsSupported: response.classificationsSupported,
      detectionsSupported: response.detectionsSupported,
      objectPointCloudsSupported: response.objectPointCloudsSupported,
    };
  }

  async captureAllFromCamera(
    cameraName: string,
    {
      returnImage,
      returnClassifications,
      returnDetections,
      returnObjectPointClouds,
    }: CaptureAllOptions,
    extra = {}
  ) {
    const request = ({
      name: this.name,
      cameraName,
      returnImage,
      returnClassifications,
      returnDetections,
      returnObjectPointClouds,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    const response = await this.client.captureAllFromCamera(request);

    return {
      image: response.image,
      classifications: response.classifications,
      detections: response.detections,
      objectPointClouds: response.objects,
    };
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
