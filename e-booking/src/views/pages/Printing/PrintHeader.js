import { CRow, CImage } from '@coreui/react'
import logo from '../../../assets/images/olympic_hotel_logo.png'
import React from 'react'

const PrintHeader = () => {
  return (
    <React.Fragment>
      <div className="d-flex my-3 printing-header ">
        <p className="col doneOn">
          Done on{' '}
          {new Date().toLocaleDateString() +
            ' at  ' +
            new Date().toLocaleTimeString()}
        </p>
        <p className="col">eBooking</p>
      </div>

      <CRow className="col d-flex flex-row">
        <div className="col-4">
          <CImage src={logo} fluid alt="olympic hotel logo" />
        </div>
        <div className="col">
          <h3 className="fw-bolder text-capitalize">OLYMPIC HOTEL</h3>
          <p>TEL: +250 789 677 479/ +250 783 103 500</p>
          <p className="email">E-mail:info@olympichotel.rw</p>
          <p className="website">Web:www.olympichotel.rw</p>
          <p>TIN/VAT: 102556009</p>
        </div>
      </CRow>
    </React.Fragment>
  )
}

export default PrintHeader
