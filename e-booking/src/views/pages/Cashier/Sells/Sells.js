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

function Sells() {
  const [sells, setSells] = useState([])
  let confirmedSells =
    sells && sells.length !== 0
      ? sells.filter((sell) => sell.status.toLowerCase() === 'comfirmed')
      : null

  const total =
    confirmedSells && confirmedSells.length !== 0
      ? confirmedSells.reduce((acc, curr) => acc + curr.amount, 0)
      : 0
  useEffect(() => {
    const getItems = async () => {
      await instance
        .get('/products/package/sells')
        .then((res) => {
          console.log(res)
          setSells(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getItems()
  }, [])

  return (
    <div>
      <CCardHeader>
        <h2>
          <strong> All sells </strong>
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
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {confirmedSells && confirmedSells.length !== 0
              ? confirmedSells.map((item, i) => {
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
                      <CTableDataCell>{`${item.amount}`}</CTableDataCell>
                    </CTableRow>
                  )
                })
              : null}

            <CTableRow>
              <CTableDataCell />
              <CTableDataCell colSpan={3}>Total</CTableDataCell>
              <CTableHeaderCell>{total.toLocaleString()}</CTableHeaderCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCardBody>
    </div>
  )
}

export default Sells
