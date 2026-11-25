import { assessmentDateInVietnam } from './project-risk.service.js';
import { RiskClient, type RiskRequest } from './risk-client.js';
import { TaskStatus } from '../tasks/task-status.enum.js';

const request: RiskRequest = {
  projectId: 'project-1',
  assessmentDate: '2026-11-18',
  tasks: [{ status: TaskStatus.TODO, dueDate: '2026-11-25' }],
};
const scored = {
  projectId: request.projectId,
  status: 'scored',
  probability: 0.25,
  modelVersion: 'synthetic-logreg-v1',
  eligibleTaskCount: 1,
  openTasksMissingDeadline: 0,
};

describe('RiskClient', () => {
  const client = new RiskClient();
  const fixtureToken = Buffer.alloc(32, 17).toString('base64url');
  beforeEach(() => vi.stubEnv('RISK_SERVICE_TOKEN', fixtureToken));
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('posts to the configured service with timeout and preserves the prediction', async () => {
    vi.stubEnv('AI_SERVICE_URL', 'https://ai.local:8100/');
    const fetch = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json(scored));
    const timeout = vi.spyOn(AbortSignal, 'timeout');
    await expect(client.predict(request)).resolves.toEqual(scored);
    expect(timeout).toHaveBeenCalledWith(4000);
    expect(fetch).toHaveBeenCalledWith('https://ai.local:8100/risk/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Risk-Service-Token': fixtureToken },
      redirect: 'manual',
      body: JSON.stringify(request),
      signal: expect.any(AbortSignal),
    });
  });

  it.each([
    { projectId: 'wrong-project' },
    { probability: 1.5 },
    { modelVersion: null },
    { eligibleTaskCount: -1 },
    { status: 'missing_deadlines' },
  ])('rejects invalid prediction %j', async (changes) => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({ ...scored, ...changes }),
    );
    await expect(client.predict(request)).rejects.toMatchObject({
      status: 502,
    });
  });

  it.each(['missing_deadlines', 'no_tasks_due_in_window'])(
    'preserves %s',
    async (status) => {
      const prediction = {
        ...scored,
        status,
        probability: null,
        modelVersion: null,
        eligibleTaskCount: 0,
        openTasksMissingDeadline: status === 'missing_deadlines' ? 1 : 0,
      };
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        Response.json(prediction),
      );
      await expect(client.predict(request)).resolves.toEqual(prediction);
    },
  );

  it('reports downstream HTTP and malformed JSON errors as 502', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response('invalid JSON'));
    await expect(client.predict(request)).rejects.toMatchObject({
      status: 502,
    });
    await expect(client.predict(request)).rejects.toMatchObject({
      status: 502,
    });
  });

  it('reports connection failure and timeout without a default probability', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new TypeError('unavailable'),
    );
    await expect(client.predict(request)).rejects.toMatchObject({
      status: 503,
    });
    vi.spyOn(AbortSignal, 'timeout').mockReturnValue(AbortSignal.abort());
    await expect(client.predict(request)).rejects.toMatchObject({
      status: 504,
    });
  });

  it('fails closed with a missing key or an HTTP remote endpoint', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch');
    vi.stubEnv('AI_SERVICE_URL', 'http://risk.internal');
    await expect(client.predict(request)).rejects.toMatchObject({ status: 503 });
    vi.stubEnv('AI_SERVICE_URL', 'http://127.0.0.1:8001');
    vi.stubEnv('RISK_SERVICE_TOKEN', undefined);
    await expect(client.predict(request)).rejects.toMatchObject({ status: 503 });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('does not follow an upstream redirect', async () => {
    vi.stubEnv('AI_SERVICE_URL', 'http://127.0.0.1:8001');
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, {
      status: 302, headers: { Location: 'https://another.invalid' },
    }));
    await expect(client.predict(request)).rejects.toMatchObject({ status: 502 });
    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ redirect: 'manual' }));
  });

  it('computes D from the Vietnam calendar at midnight', () => {
    expect(assessmentDateInVietnam(new Date('2026-11-18T16:59:59Z'))).toBe(
      '2026-11-18',
    );
    expect(assessmentDateInVietnam(new Date('2026-11-18T17:00:00Z'))).toBe(
      '2026-11-19',
    );
  });
});
