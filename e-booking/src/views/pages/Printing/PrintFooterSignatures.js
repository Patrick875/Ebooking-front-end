import React from 'react'

function PrintFooterSignatures() {
  return (
    <div className="my-4 d-flex justify-content-between">
      <div className="text-center">
        <p className="fw-bolder">Supplied by</p>
        <p className="fw-bolder text-uppercase">MARKET</p>
        <p className="my-2">................................</p>
      </div>
      <div className="text-center">
        <p className="fw-bolder">Received by</p>
        <p className="fw-bolder">(Name and Signature)</p>
        <p className="my-2">................................</p>
      </div>
      <div className="text-center">
        <p className="fw-bolder">ACCOUNTANT</p>
        <p className="fw-bolder">(Name and Signature)</p>
        <p className="my-2">................................</p>
      </div>
      <div className="text-center">
        <p className="fw-bolder">GENERAL MANAGER</p>
        <p className="fw-bolder">(Name and Signature)</p>
        <p className="my-2">................................</p>
      </div>
    </div>
  )
}

export default PrintFooterSignatures
