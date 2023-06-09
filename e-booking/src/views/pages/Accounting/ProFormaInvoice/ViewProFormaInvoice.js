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
import ReactToPrint from 'react-to-print'
import InvoiceFooter from '../../Printing/InvoiceFooter'
import PrintTemplateInvoice from '../../Printing/PrintTemplateInvoice'
import ClientDetailsProForma from '../../Printing/ClientDetailsProForma'

const Item = (props, ref) => {
  const { request, proformaDetails } = props
  const VATconstant = useSelector((state) =>
    state.constants.constants.filter((constant) => constant.name === 'VAT'),
  )[0] || { value: 0, name: 'VAT' }

  const orderTotal = request && request.total ? request.total : 0
  const amountVAT = Number((orderTotal * VATconstant.value) / 100)
  const total =
    proformaDetails[0].VAT === 'exclusive'
      ? Number(orderTotal - amountVAT)
      : Number(orderTotal + amountVAT)
  return (
    <div className="m-3 p-3">
      <CCardBody className="d-flex justify-content-around">
        <div className="col">
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                <CTableHeaderCell scope="col">times</CTableHeaderCell>
                <CTableHeaderCell scope="col">P.U</CTableHeaderCell>
                <CTableHeaderCell scope="col">T.P</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {proformaDetails && proformaDetails.length !== 0
                ? proformaDetails.map((el, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>{el.name}</CTableDataCell>
                      <CTableDataCell>{el.quantity}</CTableDataCell>
                      <CTableDataCell>{el.times}</CTableDataCell>
                      <CTableDataCell>{el.price || 1}</CTableDataCell>
                      <CTableDataCell>
                        {Number(
                          el.quantity * el.times * (el.price || 1),
                        ).toLocaleString()}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                : null}
              <CTableRow>
                <CTableHeaderCell colSpan={5}>VALUE</CTableHeaderCell>
                <CTableHeaderCell>
                  {orderTotal.toLocaleString() || 0}
                </CTableHeaderCell>
              </CTableRow>
              <CTableRow colSpan={5}>
                <CTableHeaderCell colSpan={5}>VAT</CTableHeaderCell>
                <CTableHeaderCell>
                  {amountVAT.toLocaleString() || 0}
                </CTableHeaderCell>
              </CTableRow>
              <CTableRow>
                <CTableHeaderCell colSpan={4}>Total</CTableHeaderCell>
                <CTableHeaderCell />
                <CTableHeaderCell>
                  {Number(total).toLocaleString()}
                </CTableHeaderCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
    </div>
  )
}

const ViewProFormaInvoice = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const request = useSelector((state) => state.selection.selected)
  let proformaDetails
  if (request && request.ProformaDetails) {
    proformaDetails = request.ProformaDetails
  }
  return (
    <CCard>
      <CCardHeader className="d-flex justify-content-between">
        <BackButton />
        <div className="d-flex justify-content-end">
          {proformaDetails && proformaDetails.length !== 0 ? (
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
        <PrintTemplateInvoice ref={ref || componentRef}>
          <p className="text-center my-3 text-uppercase fw-bold ">
            Pro forma Invoice N &#176;{request.proformaGenerated}
          </p>
          <ClientDetailsProForma details={proformaDetails} request={request} />
          <Item request={request} proformaDetails={proformaDetails} />
          <p className="text-center py-1 my-1">
            Your satisfaction is our concern
          </p>
          <InvoiceFooter />
        </PrintTemplateInvoice>
      </div>
      <p className="text-center my-3 text-uppercase fw-bold">
        Pro forma Invoice N &#176;{request.proformaGenerated}
      </p>
      <Item request={request} proformaDetails={proformaDetails} />
    </CCard>
  )
})

export default ViewProFormaInvoice
