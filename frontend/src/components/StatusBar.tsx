type StatusBarProps = {
  status: 'idle' | 'running' | 'passed' | 'failed' | 'error'
  message: string
}

const StatusBar = ({ status, message }: StatusBarProps) => {
  return (
    <div className={`status-bar ${status}`}>
      <span>{message}</span>
    </div>
  )
}

export default StatusBar
