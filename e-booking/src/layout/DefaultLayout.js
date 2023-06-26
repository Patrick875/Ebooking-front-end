import { React } from 'react'
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from '../components/index'
import { useSelector } from 'react-redux'
import AppHeaderWaiter from 'src/components/AppHeaderWaiter'

const DefaultLayout = () => {
  const role = useSelector((state) => state.auth.role)

  if (role.toLowerCase() === 'waiter') {
    return (
      <div className="wrapper min-vh-100 bg-light">
        <div className="body flex-grow-1 px-3">
          <AppHeaderWaiter />
          <AppContent />
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <AppSidebar />
        <div className="wrapper d-flex flex-column min-vh-100 bg-light">
          <AppHeader />
          <div className="body flex-grow-1 px-3">
            <AppContent />
          </div>
          <AppFooter />
        </div>
      </div>
    )
  }
}

export default DefaultLayout
