import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useRef } from 'react'
import { useSelector } from 'react-redux'

import BackButton from 'src/components/Navigating/BackButton'
import PrintFooterNoSignatures from '../../Printing/PrintFooterNoSignature'
import ReactToPrint from 'react-to-print'
import InvoiceHeader from '../../Printing/InvoiceHeader'

const Item = (props, ref) => {
  const { request, bonDeCommandeDetails } = props
  const orderTotal = request && request.total ? request.total : 0
  return (
    <div className="m-3 p-3">
      <h2 className="text-center my-3">
        Bon de commande N &#176; {request ? request.BonCommandeId : null}
      </h2>

      <CCardBody className="d-flex justify-content-around">
        <div className="col">
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                <CTableHeaderCell scope="col">times</CTableHeaderCell>
                <CTableHeaderCell scope="col">P.U</CTableHeaderCell>
                <CTableHeaderCell scope="col">T.P</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {bonDeCommandeDetails && bonDeCommandeDetails.length !== 0
                ? bonDeCommandeDetails.map((el, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>{i + 1}</CTableDataCell>
                      <CTableDataCell>{el.description}</CTableDataCell>
                      <CTableDataCell>{el.quantity}</CTableDataCell>
                      <CTableDataCell>{el.times}</CTableDataCell>
                      <CTableDataCell>{el.unitPrice}</CTableDataCell>
                      <CTableDataCell>
                        {Number(
                          el.quantity * el.times * el.unitPrice,
                        ).toLocaleString()}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                : null}
              <CTableRow>
                <CTableHeaderCell />
                <CTableHeaderCell colSpan={4}>Total</CTableHeaderCell>
                <CTableHeaderCell>
                  {Number(orderTotal).toLocaleString()}
                </CTableHeaderCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
    </div>
  )
}

const ViewBonDeCommande = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const request = useSelector((state) => state.selection.selected)
  console.log('req', request)
  let bonDeCommandeDetails
  if (request && request.BonDeCommandeDetails) {
    bonDeCommandeDetails = request.BonDeCommandeDetails
  }

  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <BackButton />
        <div className="d-flex justify-content-end">
          {bonDeCommandeDetails && bonDeCommandeDetails.length !== 0 ? (
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          ) : null}
        </div>
      </CCardHeader>

      <div style={{ display: 'none' }}>
        <div ref={ref || componentRef}>
          <InvoiceHeader />
          <Item request={request} bonDeCommandeDetails={bonDeCommandeDetails} />
          <PrintFooterNoSignatures />
        </div>
      </div>

      <Item request={request} bonDeCommandeDetails={bonDeCommandeDetails} />
    </CCard>
  )
})

export default ViewBonDeCommande
