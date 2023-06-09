import React from 'react'
import { CCol, CContainer, CRow } from '@coreui/react'

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
        </CRow>
      </CContainer>
    </div>
  )
}

export default NetworkError
