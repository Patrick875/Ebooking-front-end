import { CCard, CCardBody } from '@coreui/react'
import React from 'react'
import { useSelector } from 'react-redux'
import PrintHeader from './PrintHeader'
import PrintFooterNoSignatures from './PrintFooterNoSignature'

const PrintTemplate1 = React.forwardRef((props, ref) => {
  const { title } = props

  return (
    <CCard ref={ref}>
      <div className="m-3 p-3">
        <PrintHeader />
        {title ? <h2 className="text-center my-3">{title}</h2> : null}
        <CCardBody>{props.children}</CCardBody>
        <PrintFooterNoSignatures />
      </div>
    </CCard>
  )
})

export default PrintTemplate1
