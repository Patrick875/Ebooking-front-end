import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
} from '@coreui/react'

import { useSelector } from 'react-redux'

function HallInfo() {
  const selectedHall = useSelector((state) => state.selection.selected) || {}
  const onSubmit = (data) => {
    console.log(data)

    //roomClass.push(formData);
  }

  useEffect(() => {}, [])
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2 className="text-center">
              <strong> {selectedHall.name} info </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="row"
              name="roomClassAddFrm"
              encType="multipart/form"
            >
              <CCol md={6}>
                <CFormLabel htmlFor="name"> Name </CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="name"
                  id="title"
                  value={selectedHall.name}
                  readOnly={true}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="name"> Price in USD</CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="price"
                  id="title"
                  value={selectedHall.price}
                  readOnly={true}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="description">
                  Service description{' '}
                </CFormLabel>
                <CFormTextarea
                  name="description"
                  id="description"
                  defaultValue={selectedHall.description}
                  rows="3"
                  readOnly={true}
                ></CFormTextarea>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default HallInfo
