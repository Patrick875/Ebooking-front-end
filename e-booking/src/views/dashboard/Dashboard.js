import React, { useEffect } from 'react'

import { CCard, CCardBody } from '@coreui/react'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from 'src/redux/Product/productActions'
import {
  getProductCategories,
  getServiceCategories,
} from 'src/redux/Categories/categoriesActions'
import ProductSell from '../pages/products/ProductSell'
import AdminCharts from './AdminCharts'

const Dashboard = () => {
  const dispatch = useDispatch()
  const userRole = useSelector((state) => state.auth.role)
  console.log(userRole)
  const getInitialData = () => {
    dispatch(getProductCategories())
    dispatch(getServiceCategories())
    dispatch(getProducts())
  }
  useEffect(() => {
    getInitialData()
  }, [])

  return (
    <React.Fragment>
      {userRole && userRole !== 'waiter' ? <WidgetsDropdown /> : null}
      <CCard className="mb-4">
        <CCardBody>
          {userRole && userRole === 'waiter' ? <ProductSell /> : null}
        </CCardBody>
      </CCard>
    </React.Fragment>
  )
}

export default Dashboard

//  {
//    userRole && userRole === 'admin' ? <AdminCharts /> : null
//  }
