import {
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
function AllBarItems() {
  const { register } = useForm()
  const [items, setItems] = useState([])
  useEffect(() => {
    const getItems = async () => {
      await instance
        .get('/petitstock/balance')
        .then((res) => {
          setItems(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getItems()
  }, [])
  console.log('this is items', items)

  return (
    <div>
      <CCardHeader>
        <h2>
          <strong> Stock items </strong>
        </h2>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md={4}>
            <CFormLabel htmlFor="unit" className="fw-bolder">
              {' '}
              Bar{' '}
            </CFormLabel>
            <CFormSelect
              name="unit"
              id="unit"
              size="md"
              className="mb-3"
              aria-label="item quantity unit"
              {...register('bar', { required: true })}
            >
              <option value="main-bar"> Kitchen</option>
              <option value="main-bar"> Main Bar</option>
              <option value="swimming-pool-bar"> Swimming Pool Bar </option>
            </CFormSelect>
          </CCol>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {items && items.length !== 0
                ? items.map((item, i) => {
                    return (
                      <CTableRow key={item.id}>
                        <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                        <CTableDataCell>{`${item.StockItem.name}`}</CTableDataCell>
                        <CTableDataCell>{`${item.StockItem.name}`}</CTableDataCell>
                      </CTableRow>
                    )
                  })
                : null}
            </CTableBody>
          </CTable>
        </CRow>
      </CCardBody>
    </div>
  )
}

export default AllBarItems
