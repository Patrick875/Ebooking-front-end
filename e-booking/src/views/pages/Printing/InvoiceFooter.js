import React from 'react'
import { useSelector } from 'react-redux'

function InvoiceFooter(props) {
  const { request } = props
  const user = useSelector(
    (state) => state.auth.user.firstName + ' ' + state.auth.user.lastName,
  )
  return (
    <div className="my-0 py-0">
      <div className="d-flex justify-content-between mx-2">
        <div className="my-2">
          <div className="my-4">
            <p className="py-0 my-0">
              <span className="fw-bolder">BANK NAME: </span> Bank of Kigali
            </p>
            <p className="py-0 my-0">
              <span className="fw-bolder">Account No: </span>
              00040-00435393-07 /RWF
            </p>
            <p className="py-0 my-0">
              <span className="my-2 fw-bolder">Swift Code </span>: BKIGRWRW
            </p>
          </div>
          <div className="my-4">
            <p className="py-0 my-0">
              <span className="fw-bolder">BANK NAME:</span> Bank of Kigali
            </p>
            <p className="py-0 my-0">
              <span className="fw-bolder">Account No:</span> 00040-00681448-41
              /USD
            </p>
            <p className="py-0 my-0">
              <span className="my-2 fw-bolder">Swift Code</span> : BKIGRWRW
            </p>
          </div>
        </div>
        <div className="my-4">
          <p>
            Done at GASABO-KIMIRONKO,{' '}
            {request
              ? new Date(request.createdAt).toLocaleDateString('fr-FR')
              : new Date().toLocaleDateString('fr-FR')}
          </p>
          <p className="text-center">{user ? user : null}</p>
        </div>
      </div>
    </div>
  )
}

export default InvoiceFooter
