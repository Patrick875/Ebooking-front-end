import React from 'react'

function PurchaseOrderFooter() {
  return (
    <div className="my-4 d-flex justify-content-between">
      <div className="text-center">
        <p className="fw-bolder">Store keeper</p>
        <p className="fw-bolder">(Name and Signature)</p>
        <p className="my-2">................................</p>
      </div>
      <div className="text-center">
        <p className="fw-bolder">Controller</p>
        <p className="fw-bolder">(Name and Signature)</p>
        <p className="my-2">................................</p>
      </div>
      <div className="text-center">
        <p className="fw-bolder">Manager</p>
        <p className="fw-bolder">(Name and Signature)</p>
        <p className="my-2">................................</p>
      </div>
      <div className="text-center">
        <p className="fw-bolder">Cashier</p>
        <p className="fw-bolder">(Name and Signature)</p>
        <p className="my-2">................................</p>
      </div>
    </div>
  )
}

export default PurchaseOrderFooter
