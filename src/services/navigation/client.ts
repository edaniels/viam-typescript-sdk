import { Struct, type JsonValue } from '@bufbuild/protobuf';
import type { PromiseClient } from '@connectrpc/connect';
import { NavigationService } from '../../gen/service/navigation/v1/navigation_connect';
import { RobotClient } from '../../robot';
import type { GeoPoint, Options } from '../../types';
import { isValidGeoPoint } from '../../types';
import { doCommandFromClient } from '../../utils';
import type { Navigation } from './navigation';
import type { Mode } from './types';

/**
 * A gRPC-web client for a Navigation service.
 *
 * @group Clients
 */
export class NavigationClient implements Navigation {
  private client: PromiseClient<typeof NavigationService>;
  private readonly name: string;
  private readonly options: Options;

  constructor(client: RobotClient, name: string, options: Options = {}) {
    this.client = client.createServiceClient(NavigationService);
    this.name = name;
    this.options = options;
  }

  async getMode(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getMode(request)).mode;
  }

  async setMode(mode: Mode, extra = {}) {
    const request = ({
      name: this.name,
      mode,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.setMode(request);
  }

  async getLocation(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    const response = await this.client.getLocation(request);

    if (!response.location) {
      throw new Error('no location');
    }
    if (!isValidGeoPoint(response.location)) {
      throw new Error('invalid location');
    }
    return response;
  }

  async getWayPoints(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getWaypoints(request)).waypoints;
  }

  async addWayPoint(location: GeoPoint, extra = {}) {
    const request = ({
      name: this.name,
      location,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.addWaypoint(request);
  }

  async removeWayPoint(id: string, extra = {}) {
    const request = ({
      name: this.name,
      id,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    await this.client.removeWaypoint(request);
  }

  async getObstacles(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getObstacles(request)).obstacles;
  }

  async getPaths(extra = {}) {
    const request = ({
      name: this.name,
      extra: new Struct(extra),
    });

    this.options.requestLogger?.(request);

    return (await this.client.getPaths(request)).paths;
  }

  async getProperties() {
    const request = ({
      name: this.name,
    });

    this.options.requestLogger?.(request);

    return this.client.getProperties(request);
  }

  async doCommand(command: Struct): Promise<JsonValue> {
    return doCommandFromClient(this.client.doCommand, this.name, command, this.options);
  }
}
