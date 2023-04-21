import React from 'react'

function PrintDailyReport() {
  return (
    <div className="my-4 d-flex justify-content-between">
      <div className="text-center">
        <p className="fw-bolder">Receiption</p>
        <p className="fw-bolder text-uppercase">(Name and Signature)</p>
        <p className="my-2">................................</p>
      </div>
      <div className="text-center">
        <p className="fw-bolder">CASHIER</p>
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

export default PrintDailyReport
