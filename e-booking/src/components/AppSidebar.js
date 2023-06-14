import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { sygnet } from 'src/assets/brand/sygnet'
import logo from '../assets/images/olympic_hotel_logo.png'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

const newLocal = 'Logo'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow.sidebarShow)

  return (
    <CSidebar className="primary" position="fixed" visible={sidebarShow}>
      <CSidebarBrand className="d-none d-md-flex" to="/dashboard">
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={40} />
        <a className="sidebar-brand-minimized sidebar-brand-full" href="/">
          <img src={logo} height={50} alt={newLocal} />
        </a>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() =>
          dispatch({ type: 'TOGGLE_SIDEBAR', sidebarUnfoldable: !unfoldable })
        }
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
