import type { JsonValue, Struct } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import type { CameraService } from '../../gen/component/camera/v1/camera_connect';
import pb from '../../gen/component/camera/v1/camera_pb';
import { CameraServiceClient } from '../../gen/component/camera/v1/camera_pb_service';
import type { HttpBody } from '../../gen/google/api/httpbody_pb';
import type { RobotClient } from '../../robot';
import type { Options } from '../../types';
import { doCommandFromClient, promisify } from '../../utils';
import type { Camera, MimeType } from './camera';

const PointCloudPCD: MimeType = 'pointcloud/pcd';

/**
 * A gRPC-web client for the Camera component.
 *
 * @group Clients
 */
export class CameraClient implements Camera {
  private client: PromiseClient<typeof CameraService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(CameraServiceClient);
    this.name = name;
    this.options = options;
  }

  async getImage(mimeType: MimeType = '') {
    const request = new pb.GetImageRequest();
    request.setName(this.name);
    request.setMimeType(mimeType);

    this.options.requestLogger?.(request);

    const response = await promisify<pb.GetImageRequest, pb.GetImageResponse>(
      cameraService.getImage.bind(cameraService),
      request
    );

    return response.getImage_asU8();
  }

  async renderFrame(mimeType: MimeType = '') {
    const request = new pb.RenderFrameRequest();
    request.setName(this.name);
    request.setMimeType(mimeType);

    this.options.requestLogger?.(request);

    const response = await promisify<pb.RenderFrameRequest, HttpBody>(
      cameraService.renderFrame.bind(cameraService),
      request
    );

    return new Blob([response.getData_asU8()], { type: mimeType });
  }

  async getPointCloud() {
    const request = new pb.GetPointCloudRequest();
    request.setName(this.name);
    request.setMimeType(PointCloudPCD);

    this.options.requestLogger?.(request);

    const response = await promisify<
      pb.GetPointCloudRequest,
      pb.GetPointCloudResponse
    >(cameraService.getPointCloud.bind(cameraService), request);

    return response.getPointCloud_asU8();
  }

  async getProperties() {
    const request = new pb.GetPropertiesRequest();
    request.setName(this.name);

    this.options.requestLogger?.(request);

    const response = await promisify<
      pb.GetPropertiesRequest,
      pb.GetPropertiesResponse
    >(cameraService.getProperties.bind(cameraService), request);

    return response.toObject();
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
