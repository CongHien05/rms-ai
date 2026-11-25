import { HrReadStatus } from '../hr-workspace/HrReadStatus'
import { useHrData } from '../hr-workspace/useHrData'
import { PageHeading } from '../layout/PageHeading'

import { devProfilePath, readDevProfile } from './dev-profile'

const titles = {
  'dev-overview': 'Tổng quan của tôi',
  'dev-skills': 'Kỹ năng của tôi',
  'dev-work': 'Công việc của tôi',
} as const

export function DevWorkspaceView({ view }: { view: keyof typeof titles }) {
  const { state, retry } = useHrData(devProfilePath, readDevProfile)
  return (
    <section aria-labelledby="dev-workspace-title">
      <PageHeading id="dev-workspace-title" title={titles[view]} label="Chỉ xem" />
      {state.status === 'loading' && <HrReadStatus status="loading" message="Đang tải hồ sơ cá nhân…" />}
      {state.status === 'error' && <HrReadStatus status="error" message="Chưa tải được hồ sơ cá nhân." retry={retry} />}
      {state.status === 'ready' && view === 'dev-overview' && (
        <div className="panel"><h2>{state.data.employee.displayName}</h2></div>
      )}
      {state.status === 'ready' && view === 'dev-skills' && (
        state.data.skills.length ? (
          <div className="data-panel">
            <ul className="data-list">{state.data.skills.map(skill => <li key={skill.id}>{skill.name}</li>)}</ul>
          </div>
        ) : <HrReadStatus status="empty" message="Chưa có dữ liệu kỹ năng." />
      )}
      {state.status === 'ready' && view === 'dev-work' && state.data.workContext.status === 'unavailable' && (
        <HrReadStatus status="empty" message="Chưa có ngữ cảnh công việc được cấp cho bạn." />
      )}
    </section>
  )
}
