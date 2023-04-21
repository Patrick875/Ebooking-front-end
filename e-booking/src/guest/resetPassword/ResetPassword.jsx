import React from 'react'
import Button from '../Button'
import '../login/login.scss'

import Navigation from '../navigation/Navigation'
import { Link } from 'react-router-dom'
import { CButton } from '@coreui/react'
import { useForm } from 'react-hook-form'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const validateEmail = (value) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return emailRegex.test(value) || 'Invalid email address'
  }
  const resetPassword = async (data) => {
    await instance.post('/reset', { email: data.email }).then(() => {
      toast.success('check your email')
    })
  }
  return (
    <div className="App">
      <div className="App-container">
        <Navigation />

        <div className="Login">
          <div className="Login__guides">
            <h1 className="heading"> Olympic Hotel </h1>
            <p>Customer management system</p>
            <p>Hotel resources management </p>
            <p>E-booking system</p>
          </div>
          <div className="Login__form">
            <form onSubmit={handleSubmit(resetPassword)}>
              <p className="form__heading fs-5"> Reset Password </p>
              <div className="Form__row block">
                <input
                  type="text"
                  name="email"
                  id="email"
                  required
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
              )}{' '}
              {/* Display error message */}
              <div className="Form__row block">
                <Link className="login__reset__option" to="/login">
                  Login
                </Link>
              </div>
              <CButton
                type="submit"
                color="info"
                className="custom-btn"
                shape="rounded-0"
              >
                Reset password
              </CButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
