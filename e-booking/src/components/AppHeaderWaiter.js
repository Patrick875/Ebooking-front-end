import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CNavItem,
  CNavLink,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilExitToApp, cilLockLocked, cilHistory } from '@coreui/icons'
import { logout } from 'src/redux/Auth/authActions'

const AppHeaderWaiter = () => {
  const role = useSelector((state) => state.auth.role)
  const dispatch = useDispatch()

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
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
        <CHeaderNav>
          <CNavItem>
            <CNavLink href="/mysells">
              <CIcon icon={cilHistory} size="lg" /> My sells
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="/password">
              <CIcon icon={cilLockLocked} size="lg" />
              Change password
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
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
    </CHeader>
  )
}

export default AppHeaderWaiter
