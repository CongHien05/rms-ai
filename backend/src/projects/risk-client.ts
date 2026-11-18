import {
  BadGatewayException,
  GatewayTimeoutException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { Task } from '../tasks/task.entity.js';

export interface RiskRequest {
  projectId: string;
  assessmentDate: string;
  tasks: Pick<Task, 'status' | 'dueDate'>[];
}

type RiskCounts = {
  projectId: string;
  eligibleTaskCount: number;
  openTasksMissingDeadline: number;
};

export type RiskPrediction = RiskCounts &
  (
    | { status: 'scored'; probability: number; modelVersion: string }
    | {
        status: 'missing_deadlines' | 'no_tasks_due_in_window';
        probability: null;
        modelVersion: null;
      }
  );

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function isPrediction(
  value: unknown,
  request: RiskRequest,
): value is RiskPrediction {
  if (!value || typeof value !== 'object') return false;
  const response = value as Record<string, unknown>;
  const {
    probability,
    modelVersion,
    eligibleTaskCount,
    openTasksMissingDeadline,
  } = response;
  if (
    response.projectId !== request.projectId ||
    !isCount(eligibleTaskCount) ||
    !isCount(openTasksMissingDeadline) ||
    eligibleTaskCount + openTasksMissingDeadline > request.tasks.length
  )
    return false;

  if (response.status === 'scored') {
    return (
      eligibleTaskCount > 0 &&
      openTasksMissingDeadline === 0 &&
      typeof probability === 'number' &&
      Number.isFinite(probability) &&
      probability >= 0 &&
      probability <= 1 &&
      typeof modelVersion === 'string' &&
      modelVersion.trim().length > 0
    );
  }
  return (
    probability === null &&
    modelVersion === null &&
    ((response.status === 'missing_deadlines' &&
      openTasksMissingDeadline > 0) ||
      (response.status === 'no_tasks_due_in_window' &&
        eligibleTaskCount === 0 &&
        openTasksMissingDeadline === 0))
  );
}

@Injectable()
export class RiskClient {
  async predict(request: RiskRequest): Promise<RiskPrediction> {
    const baseUrl =
      process.env.AI_SERVICE_URL?.trim() || 'http://127.0.0.1:8001';
    const signal = AbortSignal.timeout(4000);
    let response: Response;
    let payload: unknown;
    try {
      response = await fetch(`${baseUrl.replace(/\/+$/, '')}/risk/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal,
      });
      payload = response.ok ? await response.json() : null;
    } catch (error) {
      if (signal.aborted) {
        throw new GatewayTimeoutException(
          'Dịch vụ đánh giá rủi ro phản hồi quá chậm.',
        );
      }
      if (error instanceof SyntaxError) {
        throw new BadGatewayException(
          'Dịch vụ đánh giá rủi ro trả dữ liệu sai định dạng.',
        );
      }
      throw new ServiceUnavailableException(
        'Không kết nối được dịch vụ đánh giá rủi ro.',
      );
    }

    if (!response.ok || !isPrediction(payload, request)) {
      throw new BadGatewayException(
        'Dịch vụ đánh giá rủi ro trả kết quả không hợp lệ.',
      );
    }

    const { projectId, status, eligibleTaskCount, openTasksMissingDeadline } =
      payload;
    const counts = { projectId, eligibleTaskCount, openTasksMissingDeadline };
    if (status === 'scored') {
      return {
        ...counts,
        status,
        probability: payload.probability,
        modelVersion: payload.modelVersion,
      };
    }
    return { ...counts, status, probability: null, modelVersion: null };
  }
}
