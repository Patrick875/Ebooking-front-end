import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilExitToApp, cilMenu } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { logout } from 'src/redux/Auth/authActions'
// import { logo } from 'src/assets/brand/logo'

const AppHeader = () => {
  const role = useSelector((state) => state.auth.role)
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => {
            return dispatch({
              type: 'TOGGLE_SIDEBAR',
              sidebarShow: !sidebarShow,
            })
          }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          {/* <CIcon icon={logo} height={48} alt="Logo" /> */}
          Olympic Hotel
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Olympic Hotel Management
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              <strong className="text-capitalize">{role}</strong>
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        {/* <CHeaderNav>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav> */}
        <CHeaderNav className="ms-3">
          <div href="#">
            <Link
              to="/login"
              className="text-secondary text-decoration-none px-2 "
              onClick={() => dispatch(logout())}
            >
              Logout
              <CIcon icon={cilExitToApp} className="mx-2 " />
            </Link>
          </div>
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
