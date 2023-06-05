import React from 'react'
import { CCard, CCardBody } from '@coreui/react'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { useSelector } from 'react-redux'
import ProductSell from '../pages/products/ProductSell'

const Dashboard = () => {
  const userRole = useSelector((state) => state.auth.role)

  return (
    <React.Fragment>
      {userRole && userRole.toLowerCase() !== 'waiter' ? (
        <WidgetsDropdown />
      ) : (
        <CCard className="mb-4">
          <CCardBody>
            {userRole && userRole.toLowerCase() === 'waiter' ? (
              <ProductSell />
            ) : null}
          </CCardBody>
        </CCard>
      )}
    </React.Fragment>
  )
}

export default Dashboard

//  {
//    userRole && userRole === 'admin' ? <AdminCharts /> : null
//  }
