import React, { useState } from 'react'
import { CButton } from '@coreui/react'
import './login.scss'
import Navigation from '../navigation/Navigation'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from 'src/redux/Auth/authActions'
import { useForm } from 'react-hook-form'

function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [formState, setformState] = useState({})
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const validateEmail = (value) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return emailRegex.test(value) || 'Invalid email address'
  }

  const submitLogin = async (data) => {
    setLoading(true)
    dispatch(login(data))
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="App">
      <div className="App-container">
        <Navigation />

        <div className="Login d-flex flex-column justify-content-center">
          <div className="Login__guides">
            <h1 className="heading my-0"> Olympic Hotel </h1>
          </div>
          <div className="Login__form">
            <form m onSubmit={handleSubmit(submitLogin)}>
              <h1 className="form__heading"> Login </h1>
              <div className="Form__row block">
                <input
                  type="text"
                  value={formState.email}
                  name="email"
                  id="email"
                  className="form__control"
                  placeholder="joe@olympichotel.rw"
                  {...register('email', {
                    required: 'Email is required',
                    validate: validateEmail,
                  })}
                />
              </div>
              {errors.email && (
                <p className="fs-6 text-danger fw-bolder">
                  {errors.email.message}
                </p>
              )}
              <div className="Form__row block">
                <input
                  type="password"
                  name="password"
                  required
                  id="password"
                  className="form__control"
                  placeholder="*********"
                  {...register('password', {
                    required: 'password is required',
                  })}
                />
              </div>
              {errors.password && (
                <p className="fs-6 text-danger fw-bolder">
                  {errors.password.message}
                </p>
              )}
              <div className="Form__row block">
                <Link
                  className="login__reset__option"
                  to="/reset"
                  exact={true}
                  activeClassName="active"
                >
                  Reset password
                </Link>
              </div>
              {(!formState?.email || !formState?.password) && (
                <CButton
                  type="submit"
                  color="white"
                  className=" btn custom-btn btn-7 px-4 py-1"
                >
                  Login
                </CButton>
              )}

              {formState?.email && formState?.password && (
                <CButton
                  type="submit"
                  className="btn custom-btn btn-7 px-4 py-1"
                  disable={loading}
                >
                  Login
                </CButton>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

// <div>
//               <p>Customer management system</p>
//               <p>Hotel resources management </p>
//               <p>E-booking system</p>
//             </div>
