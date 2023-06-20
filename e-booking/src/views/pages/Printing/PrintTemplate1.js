import { CCardBody } from '@coreui/react'
import React from 'react'
import PrintHeader from './PrintHeader'
import PrintFooterNoSignatures from './PrintFooterNoSignature'

const PrintTemplate1 = React.forwardRef((props, ref) => {
  const { title } = props

  return (
    <div ref={ref}>
      <div className="m-3 p-3">
        <PrintHeader />
        {title ? <h2 className="text-center my-3">{title}</h2> : null}
        <CCardBody>{props.children}</CCardBody>
        <PrintFooterNoSignatures />
      </div>
    </div>
  )
})

export default PrintTemplate1
