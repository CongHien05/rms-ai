import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export interface RecommendationContext {
  projectId: string;
  employeeId: string;
  skillId: string;
  weekStart: string;
  requiredHours: number;
}

export const recommendationProofPattern = /^v1\.[A-Za-z0-9_-]{43}$/;

export function recommendationKey(): Buffer | null {
  const value = process.env.WHAT_IF_CONTEXT_SECRET;
  if (!value || !/^[A-Za-z0-9_-]{43}$/.test(value)) return null;
  const key = Buffer.from(value, 'base64url');
  return key.length === 32 && key.toString('base64url') === value ? key : null;
}

export function normalizeRecommendationContext(
  context: RecommendationContext,
): RecommendationContext {
  return {
    projectId: context.projectId.toLowerCase(),
    employeeId: context.employeeId.toLowerCase(),
    skillId: context.skillId.toLowerCase(),
    weekStart: context.weekStart,
    requiredHours: context.requiredHours,
  };
}

function canonicalTuple(context: RecommendationContext) {
  const normalized = normalizeRecommendationContext(context);
  return [
    normalized.projectId,
    normalized.employeeId,
    normalized.skillId,
    normalized.weekStart,
    normalized.requiredHours,
  ];
}

export function issueRecommendationProof(
  key: Buffer,
  context: RecommendationContext,
): string {
  const signature = createHmac('sha256', key)
    .update(
      JSON.stringify([
        'recommendation-context',
        'v1',
        ...canonicalTuple(context),
      ]),
    )
    .digest('base64url');
  return `v1.${signature}`;
}

export function verifyRecommendationProof(
  key: Buffer,
  context: RecommendationContext,
  proof: string,
): boolean {
  if (!recommendationProofPattern.test(proof)) return false;
  const provided = Buffer.from(proof, 'ascii');
  const expected = Buffer.from(issueRecommendationProof(key, context), 'ascii');
  return (
    provided.length === expected.length && timingSafeEqual(provided, expected)
  );
}

export function simulationReference(
  context: RecommendationContext,
  supportHours: number,
): string {
  return createHash('sha256')
    .update(
      JSON.stringify([
        'what-if-scenario',
        'v1',
        ...canonicalTuple(context),
        supportHours,
      ]),
    )
    .digest('hex');
}
