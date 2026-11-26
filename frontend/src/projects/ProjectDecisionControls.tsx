import { useLayoutEffect, useState } from 'react'
import { DecisionRequest, type DecisionState } from './decisionRequest'
import type { DecisionEvidence } from './simulationRun'

type Props = {
  projectId: string
  evidence: DecisionEvidence
  onDecisionSaved: () => void
  onShowHistory: () => void
}

export function ProjectDecisionControls({ projectId, evidence, onDecisionSaved, onShowHistory }: Props) {
  const [request] = useState(() => new DecisionRequest(projectId, evidence))
  const [state, setState] = useState<DecisionState>({ status: 'idle' })
  useLayoutEffect(() => () => request.invalidate(), [request])

  function publish(next: DecisionState) {
    setState(next)
    if (next.status === 'saved') onDecisionSaved()
  }

  return <div className="feedback-panel">
    {(state.status === 'idle' || state.status === 'pending') && <>
      <div className="row-actions">
        <button type="button" className="button button--primary" disabled={state.status === 'pending'}
          onClick={() => void request.execute('ACCEPT', publish)}>Chấp nhận</button>
        <button type="button" className="button button--secondary" disabled={state.status === 'pending'}
          onClick={() => void request.execute('REJECT', publish)}>Từ chối</button>
      </div>
      {state.status === 'pending' && <p role="status">Đang lưu quyết định…</p>}
    </>}
    {state.status === 'saved' && <p role="status">
      {state.record.decision === 'ACCEPT' ? 'Đã lưu quyết định chấp nhận.' : 'Đã lưu quyết định từ chối.'}
    </p>}
    {'message' in state && <p className="field-error" role="alert">{state.message}</p>}
    {state.status === 'error' && <button className="button button--secondary" type="button"
      onClick={() => void request.retry(publish)}>Thử lại quyết định</button>}
    {state.status === 'conflict' && <button className="button button--secondary" type="button"
      onClick={onShowHistory}>Xem lịch sử quyết định</button>}
  </div>
}
