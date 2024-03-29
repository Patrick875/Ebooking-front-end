import { CRow, CImage } from '@coreui/react'
import logo from '../../../assets/images/olympic_hotel_logo.png'
import React from 'react'

const InvoiceHeader = (props) => {
  const { documentTitle } = props
  return (
    <React.Fragment>
      <CRow className="mx-0 px-0 col d-flex flex-row">
        <div className="col-4">
          <CImage src={logo} fluid alt="olympic hotel logo" />
        </div>
        <div className="col ">
          <p className="fw-bolder text-capitalize my-0">OLYMPIC HOTEL</p>
          <p className="my-0">TEL: +250 789 677 479/ +250 783 103 500</p>
          <p className="email my-0">E-mail:info@olympichotel.rw</p>
          <p className="website my-0">Web:www.olympichotel.rw</p>
          <p className="my-0 fw-bolder">TIN/VAT: 102556009</p>
        </div>
      </CRow>
      <div className="pt-1 mb-5 mx-0 header-line " />
      {documentTitle ? (
        <div className="col d-flex justify-content-center my-2">
          <p className="border border-2 border-dark text-center col-6">
            {documentTitle}{' '}
          </p>
        </div>
      ) : null}
    </React.Fragment>
  )
}

export default InvoiceHeader
