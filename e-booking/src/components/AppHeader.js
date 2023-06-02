import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilExitToApp, cilMenu, cilLockLocked } from '@coreui/icons'
import { logout } from 'src/redux/Auth/authActions'
// import { MdCurrencyExchange } from 'react-icons/md'

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

        <CHeaderNav>
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

export default AppHeader

//  <CHeaderDivider />
//       <CContainer fluid>
//         <AppBreadcrumb />
//       </CContainer>

//  <CHeaderNav>
//           <CNavItem>
//             <CNavLink href="/general/currencies">
//               <MdCurrencyExchange size={28} />
//               <span className="ps-1">Currencies</span>
//             </CNavLink>
//           </CNavItem>
//         </CHeaderNav>
