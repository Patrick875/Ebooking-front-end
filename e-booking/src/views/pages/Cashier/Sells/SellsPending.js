import {
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'

function SellsPending() {
  const [sells, setSells] = useState([])
  let pendingSells =
    sells && sells.length !== 0
      ? sells.filter((sell) => sell.status === 'PENDING')
      : null
  useEffect(() => {
    const getProductSells = async () => {
      await instance
        .get('/products/package/sells')
        .then((res) => {
          setSells(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    const getPendingServices = async () => {
      await instance
        .get('/services/sells')
        .then((res) => {
          //setSells([...sells, ...res.data.data])
          console.log('these are pending services', res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getPendingServices()
    getProductSells()
  }, [])

  const confirmSell = async (data) => {
    await instance
      .post('/products/package/sells/approve', data)
      .then(() => {
        toast.success('order confirmed')
        const updatedData = sells.filter((item) => item.id !== data.id)
        setSells(updatedData)
      })
      .catch(() => {
        toast.error('order confirm failed')
      })
  }
  const cancelSell = async (data) => {
    await instance
      .post('/products/package/sells/cancel', data)
      .then(() => {
        toast.success('order concel success')
        const updatedData = sells.filter((item) => !item)
        setSells(updatedData)
      })
      .catch(() => {
        toast.error('order cancel failed')
      })
  }

  return (
    <div>
      <CCardHeader>
        <h2>
          <strong> Sells pending </strong>
        </h2>
      </CCardHeader>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Account</CTableHeaderCell>
              <CTableHeaderCell scope="col">Product</CTableHeaderCell>
              <CTableHeaderCell scope="col">Price</CTableHeaderCell>
              <CTableHeaderCell scope="col">Qty</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {pendingSells && pendingSells.length !== 0
              ? pendingSells.map((item, i) => {
                  return (
                    <CTableRow key={item.id}>
                      <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                      <CTableDataCell>{`${item.petitStock.name}`}</CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {item.petitStockSaleDetails.map((el, i) => (
                            <p key={el + i}>
                              {' '}
                              {el.quantity}{' '}
                              {el.quantity > 1
                                ? `${el.Package.name}s`
                                : el.Package.name}{' '}
                              of {el.Package.Products.name}{' '}
                            </p>
                          ))}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {item.petitStockSaleDetails.map((el, i) => (
                            <p key={el + i}>
                              {el.Package.Products.ProductPackage.price}
                            </p>
                          ))}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {item.petitStockSaleDetails.map((el, i) => (
                            <p key={el + i}>{el.quantity}</p>
                          ))}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{`${item.amount}`}</CTableDataCell>
                      <CTableDataCell className="d-flex gap-3">
                        <div
                          className="btn btn-primary btn-sm"
                          onClick={() => confirmSell({ id: item.id })}
                        >
                          Confirm
                        </div>
                        <div className="btn btn-danger btn-sm">Cancel</div>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              : null}
          </CTableBody>
        </CTable>
      </CCardBody>
    </div>
  )
}

export default SellsPending
