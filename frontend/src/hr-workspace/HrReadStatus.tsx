type ReadStatusProps =
  | { status: 'loading' | 'empty'; message: string }
  | { status: 'error'; message: string; retry: () => void }

export function HrReadStatus(props: ReadStatusProps) {
  const hasError = props.status === 'error'

  return (
    <div className={`feedback-panel${hasError ? ' feedback-panel--error' : ''}`}>
      <p role={hasError ? 'alert' : 'status'}>{props.message}</p>
      {props.status === 'error' && (
        <button className="button button--secondary" type="button" onClick={props.retry}>Thử lại</button>
      )}
    </div>
  )
}
