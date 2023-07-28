import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

const ProductPackages = () => {
  const [packages, setPackages] = useState([])

  useEffect(() => {
    const getAllPackages = async () => {
      await instance
        .get('/packages/all')
        .then((res) => {
          if (res.status === 200) {
            setPackages(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getAllPackages()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> All Packages </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Name </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Category </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {packages && packages.length !== 0
                  ? packages.map((el, i) => (
                      <CTableRow key={i}>
                        <CTableDataCell>{i + 1}</CTableDataCell>
                        <CTableDataCell>{el.name}</CTableDataCell>
                        <CTableDataCell>
                          {el.ProductCategory.name}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  : null}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProductPackages
