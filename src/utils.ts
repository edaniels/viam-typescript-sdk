import { Struct, type JsonValue, type PartialMessage } from '@bufbuild/protobuf';
import type { CallOptions } from '@connectrpc/connect';
import { apiVersion } from './api-version';
import common, { DoCommandRequest, DoCommandResponse } from './gen/common/v1/common_pb';
import type { Options, Vector3 } from './types';

export const clientHeaders = new Headers({
  'viam-client': `typescript;v${__VERSION__};${apiVersion}`,
});

type doCommand = (request: PartialMessage<DoCommandRequest>, options?: CallOptions) => Promise<DoCommandResponse>

/** Send/Receive an arbitrary command using a resource client */
export const doCommandFromClient = async function doCommandFromClient(
  doCommander: doCommand,
  name: string,
  command: Struct,
  options: Options = {}
): Promise<JsonValue> {
  const request = new common.DoCommandRequest({
    name,
    command: new Struct(command),
  });

  options.requestLogger?.(request);

  const response = await doCommander(request);
  const result = response.result?.toJson();
  if (!result) {
    return {};
  }
  return result;
};

/** Convert a 3D Vector POJO to a Protobuf Datatype */
export const encodeVector3 = (value: Vector3): common.Vector3 => {
  return new common.Vector3({
    x: value.x,
    y: value.y,
    z: value.z,
  });
};
