import { CRow, CImage } from '@coreui/react'
import logo from '../../../assets/images/olympic_hotel_logo.png'
import React from 'react'

const PrintHeader = () => {
  return (
    <React.Fragment>
      <CRow className="col d-flex flex-row my-0 py-0">
        <div className="col-3 my-0 py-0">
          <CImage src={logo} fluid alt="olympic hotel logo" />
        </div>
        <div className="col my-0 py-0">
          <h5 className="fw-bolder text-capitalize my-0 py-0">OLYMPIC HOTEL</h5>
          <p className="my-0 py-0">TEL: +250 789 677 479/ +250 783 103 500</p>
          <p className="email my-0 py-0">E-mail:info@olympichotel.rw</p>
          <p className="website my-0 py-0">Web:www.olympichotel.rw</p>
          <p className="my-0 py-0">TIN/VAT: 102556009</p>
        </div>
      </CRow>
    </React.Fragment>
  )
}

export default PrintHeader
