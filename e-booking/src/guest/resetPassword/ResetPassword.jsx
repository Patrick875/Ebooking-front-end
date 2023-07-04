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

        <h1
          className="text-center heading my-0 py-2"
          style={{ color: 'rgb(232,170,0)' }}
        >
          {' '}
          Olympic Hotel{' '}
        </h1>
        <div className="d-flex justify-content-center">
          <div
            className="col-md-4 rounded-2 bg-white shadow shadow-sm my-3"
            style={{ color: 'black' }}
          >
            <form onSubmit={handleSubmit(resetPassword)} className="p-4">
              <p className="form__heading fs-5 text-center"> Reset Password </p>
              <div className="Form__row block">
                <label htmlFor="email">Email</label>
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
              <CButton
                type="submit"
                color="info"
                className="my-3 py-2"
                shape="rounded-0"
              >
                Reset password
              </CButton>
              <div className="Form__row block">
                <Link className="login__reset__option" to="/login">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
