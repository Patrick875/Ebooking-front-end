import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'

function SellsTable(props) {
  const { confirmedSells, perpage, currentPage, total } = props
  return (
    <CTable bordered>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col">Account</CTableHeaderCell>
          <CTableHeaderCell scope="col">By</CTableHeaderCell>
          <CTableHeaderCell scope="col">Product/Service</CTableHeaderCell>
          <CTableHeaderCell scope="col">Price/unit</CTableHeaderCell>
          <CTableHeaderCell scope="col">Total</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {confirmedSells && confirmedSells.length !== 0
          ? confirmedSells.map((item, i) => {
              return (
                <CTableRow key={item.id}>
                  <CTableHeaderCell scope="row">
                    {(currentPage - 1) * perpage + 1 + i}
                  </CTableHeaderCell>
                  <CTableDataCell>
                    {item.petitStock
                      ? item.petitStock.name
                      : item.ServiceCategory.name}
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.Service
                      ? item.User.firstName + ' ' + item.User.lastName
                      : item.user.firstName + ' ' + item.user.lastName}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>
                      {item.Service ? (
                        <p key={item.id * 100}>
                          {item.Service.name}
                          {' ' + item.total / item.Service.price + ' times'}
                        </p>
                      ) : (
                        item.petitStockSaleDetails.map((el, i) => (
                          <p key={el + i}>
                            {el.quantity}{' '}
                            {el.quantity > 1
                              ? `${el.Package.name}s`
                              : el.Package.name}{' '}
                            of {el.Package.Products.name}{' '}
                          </p>
                        ))
                      )}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    <div>
                      {item.Service
                        ? item.Service.price
                        : item.petitStockSaleDetails.map((el, i) => (
                            <p key={el + i}>
                              {el.Package.Products.ProductPackage.price}
                            </p>
                          ))}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    {item.Service ? item.total : item.amount}
                  </CTableDataCell>
                </CTableRow>
              )
            })
          : null}

        <CTableRow>
          <CTableDataCell />
          <CTableDataCell colSpan={4}>Total</CTableDataCell>
          <CTableHeaderCell>{total.toLocaleString()}</CTableHeaderCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  )
}

export default SellsTable
