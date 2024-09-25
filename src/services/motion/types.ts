import pb from '../../gen/service/motion/v1/motion_pb';

export type Constraints = pb.Constraints;
export type ObstacleDetector = pb.ObstacleDetector;
export type LinearConstraint = pb.LinearConstraint;
export type OrientationConstraint = pb.OrientationConstraint;
export type CollisionSpecification = pb.CollisionSpecification;
export type MotionConfiguration = Partial<pb.MotionConfiguration>;
export type GetPlanResponse = pb.GetPlanResponse;
export type ListPlanStatusesResponse = pb.ListPlanStatusesResponse;
type ValueOf<T> = T[keyof T];
export const { PlanState } = pb;
export type PlanState = ValueOf<typeof pb.PlanState>;
