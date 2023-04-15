import React, { Suspense, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import { getRoles } from './redux/Roles/RolesActions'
import Cookies from 'js-cookie'
import { logout } from './redux/Auth/authActions'
import ConnectionCheck from './utils/ConnectionCheck'
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Login = React.lazy(() => import('./guest/login/Login'))
const ResetPassword = React.lazy(() =>
  import('./guest/resetPassword/ResetPassword'),
)

function App() {
  const isAuth = useSelector((state) => state.auth.isAuth)
  const role = useSelector((state) => state.auth.role)
  const dispatch = useDispatch()
  const token = Cookies.get('token')

  useEffect(() => {
    if (isAuth && role === 'admin') {
      dispatch(getRoles())
    }
    if (!token) {
      dispatch(logout())
    }
  }, [])

  console.log('App component', isAuth)

  return (
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route
            exact
            path="/register"
            name="Register Page"
            element={<Register />}
          />
          <Route
            exact
            path="/reset"
            name="Reset Page"
            element={<ResetPassword />}
          />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route
            path={'*'}
            name="Home"
            element={isAuth ? <DefaultLayout /> : <Login />}
          />
        </Routes>
      </Suspense>
      <Toaster />
      <ConnectionCheck />
    </BrowserRouter>
  )
}

export default App
