import { CCard, CCardBody } from '@coreui/react'
import React from 'react'
import PrintFooterNoSignatures from './PrintFooterNoSignature'
import InvoiceHeader from './InvoiceHeader'

const PrintTemplateInvoice = React.forwardRef((props, ref) => {
  const { documentTitle } = props

  return (
    <div ref={ref}>
      <div className="m-3 p-3">
        <InvoiceHeader documentTitle={documentTitle} />
        <div>{props.children}</div>
      </div>
    </div>
  )
})

export default PrintTemplateInvoice
