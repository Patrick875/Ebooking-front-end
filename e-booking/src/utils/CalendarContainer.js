import { Portal } from 'react-overlays'

const CalendarContainer = ({ children }) => {
  const el = document.getElementById('calendar-portal')

  return <Portal container={el}>{children}</Portal>
}

export default CalendarContainer
