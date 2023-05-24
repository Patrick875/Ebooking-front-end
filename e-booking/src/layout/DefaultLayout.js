import { React, useEffect } from 'react'
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from '../components/index'
import { useDispatch, useSelector } from 'react-redux'
import AppHeaderWaiter from 'src/components/AppHeaderWaiter'
import { instance } from 'src/API/AxiosInstance'
import { storeConstants } from 'src/redux/Constants/constantsActions'

const DefaultLayout = () => {
  const role = useSelector((state) => state.auth.role)
  const dispatch = useDispatch()
  useEffect(() => {
    const getConstants = async () => {
      await instance.get('/constants/all').then((res) => {
        dispatch(storeConstants(res.data.data))
      })
    }
    getConstants()
  }, [])
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
