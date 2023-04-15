import React, { useRef, useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CToast,
  CToastBody,
  CToastClose,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import { DocsExample } from 'src/components'

const SuccessNotification = ({ activate, text }) => {
  return (
    <CToaster placement="top-end">
      <CToast
        autohide={true}
        visible={activate}
        delay={5000}
        className="align-items-center btn-success"
      >
        <div className="d-flex">
          <CToastBody>{text}</CToastBody>
          <CToastClose className="me-2 m-auto" />
        </div>
      </CToast>
    </CToaster>
  )
}

export default SuccessNotification
