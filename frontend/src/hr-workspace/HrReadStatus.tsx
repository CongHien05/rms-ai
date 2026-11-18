type ReadStatusProps =
  | { status: 'loading' | 'empty'; message: string }
  | { status: 'error'; message: string; retry: () => void }

export function HrReadStatus(props: ReadStatusProps) {
  return (
    <div className="foundation-primary">
      <p role={props.status === 'error' ? 'alert' : 'status'}>{props.message}</p>
      {props.status === 'error' && (
        <button className="button button--secondary" type="button" onClick={props.retry}>
          Thử lại
        </button>
      )}
    </div>
  )
}
