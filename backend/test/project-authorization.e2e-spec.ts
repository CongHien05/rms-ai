import { openAuthApp } from './auth-http-fixture.js';
import { fixtureCookie, hrId, pmId, secondPmId, testOrigin } from './auth-test-fixtures.js';

const visible = 'a1111111-1111-4111-8111-111111111111';
const privateProject = 'a2222222-2222-4222-8222-222222222222';
const unassigned = 'a3333333-3333-4333-8333-333333333333';
const sprint = 'a4444444-4444-4444-8444-444444444444';
const task = 'a5555555-5555-4555-8555-555555555555';

it('filters Project list and checks direct and inherited ownership before task and proof work', async () => {
  const state = await openAuthApp();
  try {
    state.projects.set(visible, { id: visible, pmAccountId: pmId, name: 'Visible', sprints: [] });
    state.projects.set(privateProject, { id: privateProject, pmAccountId: secondPmId, name: 'Private', sprints: [] });
    state.projects.set(unassigned, { id: unassigned, pmAccountId: null, name: 'Blocked', sprints: [] });
    state.sprints.set(sprint, { id: sprint, projectId: privateProject, name: 'Private sprint' } as never);
    const cookie = fixtureCookie(pmId);
    await state.client.get('/projects').set('Cookie', cookie).expect(200, [{ id: visible, name: 'Visible' }]);
    for (const path of [`/projects/${privateProject}`, `/projects/${unassigned}`, `/projects/${privateProject}/sprints`, `/sprints/${sprint}/tasks`]) {
      await state.client.get(path).set('Cookie', cookie).expect(403);
    }
    await state.client.patch(`/sprints/${sprint}/tasks/${task}`).set('Cookie', cookie)
      .set('Origin', testOrigin).send({status:'DONE'}).expect(403);
    await state.client.post(`/projects/${privateProject}/simulations`).set('Cookie', cookie).set('Origin', testOrigin)
      .send({ runId: task, scenario: { employeeId: task, skillId: task, weekStart: '2026-11-16',
        requiredHours: 8, supportHours: 4, recommendationContext: 'v1.' + 'A'.repeat(43) } }).expect(403);
    await state.client.get(`/projects/${privateProject}`).set('Cookie', fixtureCookie(hrId)).expect(403);
    expect(state.taskReads).not.toHaveBeenCalled();
    expect(state.taskWrites).not.toHaveBeenCalled();
  } finally {
    await state.app.close();
    vi.unstubAllEnvs();
  }
});
