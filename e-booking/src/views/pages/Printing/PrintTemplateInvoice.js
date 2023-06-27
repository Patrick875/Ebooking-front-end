import React from 'react'
import InvoiceHeader from './InvoiceHeader'

const PrintTemplateInvoice = React.forwardRef((props, ref) => {
  const { documentTitle } = props

  return (
    <div ref={ref}>
      <div className="my-3 mx-0 px-0 py-3">
        <InvoiceHeader documentTitle={documentTitle} />
        <div>{props.children}</div>
      </div>
    </div>
  )
})

export default PrintTemplateInvoice
