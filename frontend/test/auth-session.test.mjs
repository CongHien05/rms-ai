import assert from 'node:assert/strict'
import test from 'node:test'
import { createSession, requestedProjectView } from '../src/auth/session.ts'

function authenticated(role, accountId = role) {
  return Response.json({ accountId, role })
}

test('mounts identity only after a successful session bootstrap and ignores invalid claims', async () => {
  const session = createSession(async () => authenticated('DEV'))
  assert.equal(session.getState().status, 'checking')
  await session.restore()
  assert.equal(session.getState().account.role, 'DEV')
  const unknown = createSession(async () => authenticated('ADMIN'))
  await unknown.restore()
  assert.equal(unknown.getState().status, 'unavailable')
})

test('keeps identity on 403 and clears it on 401', async () => {
  const responses = [authenticated('PM'), new Response(null, { status: 403 }), new Response(null, { status: 401 })]
  const session = createSession(async () => responses.shift())
  await session.restore()
  await session.request('/api/projects')
  assert.equal(session.getState().forbidden, true)
  await session.request('/api/projects')
  assert.equal(session.getState().status, 'anonymous')
})

test('a late 401 from the old account does not clear a replacement account', async () => {
  let finish
  const session = createSession(async path => {
    if (path.endsWith('/me')) return authenticated('PM')
    if (path.endsWith('/logout')) return new Response(null, { status: 204 })
    if (path.endsWith('/login')) return authenticated('HR')
    return new Promise(resolve => { finish = resolve })
  })
  await session.restore()
  const old = session.request('/api/projects')
  const discarded = assert.rejects(old, { name: 'AbortError' })
  await session.logout()
  await session.login('x@example.invalid', 'test fixture')
  finish(new Response(null, { status: 401 }))
  await discarded
  assert.equal(session.getState().account.role, 'HR')
})

test('network failure hides workspace until logout can be confirmed', async () => {
  let tries = 0
  const session = createSession(async path => {
    if (path.endsWith('/me')) return authenticated('PM')
    if (!tries++) throw new Error('network unavailable')
    return new Response(null, { status: 401 })
  })
  await session.restore()
  await session.logout()
  assert.equal(session.getState().status, 'logout-error')
  await session.logout()
  assert.equal(session.getState().status, 'anonymous')
})

test('accepts only known internal PM deep links', () => {
  assert.deepEqual(requestedProjectView('#projects'), { name: 'projects' })
  assert.deepEqual(requestedProjectView('#project/12345678-1234-4321-8765-123456789ABC'), {
    name: 'project-detail', projectId: '12345678-1234-4321-8765-123456789abc',
  })
  assert.equal(requestedProjectView('#//other.invalid'), null)
  assert.equal(requestedProjectView('#project/bad-id'), null)
})
