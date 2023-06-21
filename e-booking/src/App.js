import React, { Suspense, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import Cookies from 'js-cookie'
import { logout } from './redux/Auth/authActions'
import ConnectionCheck from './utils/ConnectionCheck'
import { GridLoader } from 'react-spinners'

const Loading = (
  <div
    className="d-flex align-items-center justify-content-center"
    style={{ height: '100vh' }}
  >
    <GridLoader color="#104165" />
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
// const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const NetworkError = React.lazy(() =>
  import('./views/pages/page404/NetworkError'),
)
const Login = React.lazy(() => import('./guest/login/Login'))
const ResetPassword = React.lazy(() =>
  import('./guest/resetPassword/ResetPassword'),
)

function App() {
  const isAuth = useSelector((state) => state.auth.isAuth)
  const dispatch = useDispatch()
  const token = Cookies.get('token')

  useEffect(() => {
    if (!token) {
      dispatch(logout())
    }
  }, [])

  if (navigator.onLine === false) {
    return <NetworkError />
  }

  return (
    <BrowserRouter>
      <Suspense fallback={Loading}>
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
          <Route
            path={'*'}
            name="Home"
            element={isAuth ? <DefaultLayout /> : <Login />}
          />
          <Route path={'/error'} name="Error page" element={<NetworkError />} />
        </Routes>
      </Suspense>
      <Toaster />
      <ConnectionCheck />
    </BrowserRouter>
  )
}

export default App
