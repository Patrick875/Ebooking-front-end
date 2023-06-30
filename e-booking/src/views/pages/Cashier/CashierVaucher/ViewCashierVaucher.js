import React, { useRef } from 'react'
import { CButton } from '@coreui/react'
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
          <div>
            <div>
              <p className="text-center fw-bold text-uppercase py-1">
                Vaucher {vaucher.vaucherId}
              </p>
            </div>
            <div className="py-2  ">
              <div className="d-flex justify-content-between gap-3">
                <div className="col-6 d-flex gap-2">
                  {' '}
                  <p className="fw-bold"> Name:</p>{' '}
                  <div className="my-0 py-0 col">
                    <p
                      className="my-0 py-0 col"
                      style={{ borderBottomStyle: 'dotted' }}
                    >
                      {' '}
                      {vaucher.doneTo}
                    </p>
                  </div>
                </div>
                <div className="col-6 d-flex gap-2">
                  {' '}
                  <p className="fw-bold"> Amount:</p>{' '}
                  <div className="my-0 py-0 col">
                    <p
                      className="my-0 py-0 col"
                      style={{ borderBottomStyle: 'dotted' }}
                    >
                      {' '}
                      {Number(vaucher.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between gap-3">
                <div className="col-6 d-flex gap-2">
                  {' '}
                  <p className="fw-bold"> Reason:</p>{' '}
                  <div className="my-0 py-0 col">
                    <p
                      className="my-0 py-0 col"
                      style={{ borderBottomStyle: 'dotted' }}
                    >
                      {' '}
                      {vaucher.description}
                    </p>
                  </div>
                </div>

                <div className="col-6 d-flex gap-2">
                  {' '}
                  <p className="fw-bold"> Done by:</p>{' '}
                  <div className="my-0 py-0 col">
                    <p
                      className="my-0 py-0 col"
                      style={{ borderBottomStyle: 'dotted' }}
                    >
                      {vaucher.User.firstName + ' ' + vaucher.User.lastName}{' '}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div>
                <p className="fw-bold ">Receiver</p>
                <p className="fw-bold ">.....................</p>
              </div>
              <div>
                <p className="fw-bold">Cashier</p>
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
