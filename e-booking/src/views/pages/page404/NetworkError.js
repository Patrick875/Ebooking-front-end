import React, { useEffect, useState } from 'react'
import { CCol, CContainer, CRow } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const RefreshTimer = () => {
  const [seconds, setSeconds] = useState(5)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1)
    }, 1000)

    if (seconds === 0) {
      clearInterval(timer)
      navigate(-1)
    }

    return () => {
      clearInterval(timer)
    }
  }, [seconds])

  return (
    <div>
      <h2>Navigating back in: {seconds} seconds</h2>
    </div>
  )
}

const NetworkError = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h5 className="text-center">🔥🔥🔥</h5>
              <h1 className="float-start display-3 me-4">No Network</h1>
              <h4 className="pt-3 text-medium-emphasis float-start">
                Oops! You{"'"}re lost.
              </h4>
              <p className="text-medium-emphasis float-start">
                You just temporarily lost your connection. Try refreshing your
                browser
              </p>
            </div>
          </CCol>
          <div className="d-flex justify-content-center">
            <RefreshTimer />
          </div>
        </CRow>
      </CContainer>
    </div>
  )
}

export default NetworkError
