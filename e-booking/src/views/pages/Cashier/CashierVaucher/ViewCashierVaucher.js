import React, { useRef } from 'react'
import { CButton, CCard, CFormInput, CFormLabel } from '@coreui/react'
import PrintHeader from '../../Printing/PrintHeader'
import ReactToPrint from 'react-to-print'

const ViewCashierVaucher = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { vaucher, setViewVaucher } = props

  return (
    <div>
      <div>
        <div className="d-flex justify-content-between">
          <CButton
            className="my-2"
            onClick={() => {
              setViewVaucher(false)
            }}
          >
            All Vauchers
          </CButton>
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost-primary">Print</button>
            )}
            content={() => ref || componentRef.current}
          />
        </div>

        <div ref={ref || componentRef}>
          <PrintHeader />
          <CCard className="p-5">
            <p className="text-center text-uppercase fw-bold fs-6">
              vaucher {vaucher.id}
            </p>
            <div className=" d-flex justify-content-between gap-3">
              <div className="col-6">
                <CFormLabel> Names</CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="names"
                  id="names"
                  required
                  readOnly
                  defaultValue={vaucher.doneTo}
                />
              </div>
              <div className="col-6">
                <CFormLabel>Amount</CFormLabel>
                <input
                  className="mb-1 form-control"
                  name="amount"
                  id="amount"
                  type="number"
                  required
                  readOnly
                  defaultValue={Number(vaucher.amount)}
                />
              </div>
            </div>
            <div className="d-flex justify-content-between gap-3">
              <div className="col-6">
                <CFormLabel>Reason</CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="reason"
                  id="reason"
                  required
                  readOnly
                  defaultValue={vaucher.description}
                />
              </div>
              <div className="col-6">
                <CFormLabel>Done by</CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="doneBy"
                  id="doneBy"
                  readOnly
                  required
                  defaultValue={
                    vaucher.User.firstName + ' ' + vaucher.User.lastName
                  }
                />
              </div>
            </div>
          </CCard>

          <div className="my-3">
            <div className="d-flex justify-content-between my-3 py-4">
              <div className="d-flex gap-2">
                <p className="fw-bold ">PREPARED BY </p>
                <p className="fw-bold ">.....................</p>
              </div>
              <div className="d-flex gap-2">
                <p className="fw-bold">CHECKED BY </p>
                <p className="fw-bold">.....................</p>
              </div>
              <div className="d-flex gap-2">
                <p className="fw-bold">APPROVED BY </p>
                <p className="fw-bold">.....................</p>
              </div>
              <div className="d-flex gap-2">
                <p className="fw-bold">RECEIVED BY </p>
                <p className="fw-bold">.....................</p>
              </div>
            </div>
            <p>Done on : {new Date(vaucher.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ViewCashierVaucher

//  <div>
//               <p className="text-center fw-bold text-uppercase py-1">
//                 Vaucher {vaucher.vaucherId}
//               </p>
//             </div>
//             <div className="py-2  ">
//               <div className="d-flex justify-content-between gap-3">
//                 <div className="col-6 d-flex gap-2">
//                   {' '}
//                   <p className="fw-bold"> Name:</p>{' '}
//                   <div className="my-0 py-0 col">
//                     <p
//                       className="my-0 py-0 col"
//                       style={{ borderBottomStyle: 'dotted' }}
//                     >
//                       {' '}
//                       {vaucher.doneTo}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="col-6 d-flex gap-2">
//                   {' '}
//                   <p className="fw-bold"> Amount:</p>{' '}
//                   <div className="my-0 py-0 col">
//                     <p
//                       className="my-0 py-0 col"
//                       style={{ borderBottomStyle: 'dotted' }}
//                     >
//                       {' '}
//                       {Number(vaucher.amount).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="d-flex justify-content-between gap-3">
//                 <div className="col-6 d-flex gap-2">
//                   {' '}
//                   <p className="fw-bold"> Reason:</p>{' '}
//                   <div className="my-0 py-0 col">
//                     <p
//                       className="my-0 py-0 col"
//                       style={{ borderBottomStyle: 'dotted' }}
//                     >
//                       {' '}
//                       {vaucher.description}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="col-6 d-flex gap-2">
//                   {' '}
//                   <p className="fw-bold"> Done by:</p>{' '}
//                   <div className="my-0 py-0 col">
//                     <p
//                       className="my-0 py-0 col"
//                       style={{ borderBottomStyle: 'dotted' }}
//                     >
//                       {vaucher.User.firstName + ' ' + vaucher.User.lastName}{' '}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
