import React from 'react'
import Button from '../Button'
import '../login/login.scss'

import Navigation from '../navigation/Navigation'
import { Link } from 'react-router-dom'
import { CButton } from '@coreui/react'

function ResetPassword() {
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
            <form>
              <h1 className="form__heading"> Rest Password </h1>
              <div className="Form__row block">
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="form__control"
                  placeholder="joe@olympichotel.rw"
                />
              </div>
              <div className="Form__row block">
                <Link className="login__reset__option" to="/login">
                  Login
                </Link>
              </div>
              <CButton type="submit" color="info" shape="rounded-0">
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
