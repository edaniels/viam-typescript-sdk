import { createPromiseClient, type PromiseClient, type Transport } from '@connectrpc/connect';
import { MLTrainingService } from '../gen/app/mltraining/v1/ml_training_connect';

import { ModelType, TrainingStatus } from '../gen/app/mltraining/v1/ml_training_pb';


export class MlTrainingClient {
  private client: PromiseClient<typeof MLTrainingService>;

  constructor(transport: Transport) {
    this.client = createPromiseClient(MLTrainingService, transport);
  }

  async submitTrainingJob(
    organizationId: string,
    datasetId: string,
    modelName: string,
    modelVersion: string,
    modelType: ModelType,
    tags: string[]
  ) {
    return (await this.client.submitTrainingJob({
      organizationId,
      datasetId,
      modelName,
      modelVersion,
      modelType,
      tags,
    })).id;
  }

  async submitCustomTrainingJob(
    organizationId: string,
    datasetId: string,
    registryItemId: string,
    registryItemVersion: string,
    modelName: string,
    modelVersion: string
  ) {
    return (await this.client.submitCustomTrainingJob({
      organizationId,
      datasetId,
      registryItemId,
      registryItemVersion,
      modelName,
      modelVersion,
    })).id;
  }

  async getTrainingJob(id: string) {
    return (await this.client.getTrainingJob({ id })).metadata;
  }

  async listTrainingJobs(organizationId: string, status: TrainingStatus) {
    return (await this.client.listTrainingJobs({ organizationId, status })).jobs;
  }

  async cancelTrainingJob(id: string) {
    await this.client.cancelTrainingJob({ id });
  }

  async deleteCompletedTrainingJob(id: string) {
    await this.client.deleteCompletedTrainingJob({ id });
  }
}

export {ModelType, TrainingStatus} from '../gen/app/mltraining/v1/ml_training_pb';