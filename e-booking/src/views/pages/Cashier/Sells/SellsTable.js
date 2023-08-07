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
  const {
    confirmedSells,
    perpage,
    currentPage,
    total,
    cashTotal,
    momoTotal,
    posTotal,
  } = props
  return (
    <CTable bordered>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col">Account</CTableHeaderCell>
          <CTableHeaderCell scope="col">By</CTableHeaderCell>
          <CTableHeaderCell scope="col">Product/Service</CTableHeaderCell>
          <CTableHeaderCell scope="col">Price/unit</CTableHeaderCell>
          <CTableHeaderCell scope="col">CASH</CTableHeaderCell>
          <CTableHeaderCell scope="col">MOMO</CTableHeaderCell>
          <CTableHeaderCell scope="col">POS</CTableHeaderCell>
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
                            {' '}
                            {el.Package.name} of {el.Package.Products.name}{' '}
                            {`[ ${el.quantity} ]`}{' '}
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
                    {Number(item.paymentMethod.CASH).toLocaleString()}
                  </CTableDataCell>
                  <CTableDataCell>
                    {Number(item.paymentMethod.MOMO).toLocaleString()}
                  </CTableDataCell>
                  <CTableDataCell>
                    {Number(item.paymentMethod.POS).toLocaleString()}
                  </CTableDataCell>
                  <CTableDataCell>
                    {Number(
                      item.Service ? item.total : item.amount,
                    ).toLocaleString()}
                  </CTableDataCell>
                </CTableRow>
              )
            })
          : null}

        <CTableRow>
          <CTableDataCell />
          <CTableDataCell colSpan={4}>Total</CTableDataCell>
          <CTableDataCell>{Number(cashTotal).toLocaleString()}</CTableDataCell>
          <CTableDataCell>{Number(momoTotal).toLocaleString()}</CTableDataCell>
          <CTableDataCell>{Number(posTotal).toLocaleString()}</CTableDataCell>
          <CTableHeaderCell>{total.toLocaleString()}</CTableHeaderCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  )
}

export default SellsTable
