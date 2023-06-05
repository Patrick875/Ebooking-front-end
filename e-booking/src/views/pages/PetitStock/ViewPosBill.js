import React from 'react'
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
import { useSelector } from 'react-redux'
import BackButton from 'src/components/Navigating/BackButton'

const PosBillView = (props) => {
  const { user, orderItems, table, petitStock, created } = props
  return (
    <div>
      <div className="text-center">
        <p>OLYMPIC HOTEL</p>
        <p>TEL:+250783103500 / 0789677479</p>

        <p>{new Date(created).toLocaleString()}</p>
        <p>
          <span>BON DE COMMANDE/</span>
          {petitStock}
        </p>
      </div>

      <CTable bordered>
        <CTableHead>
          <CTableRow></CTableRow>
          <CTableHeaderCell scope="col">#</CTableHeaderCell>
          <CTableHeaderCell scope="col"> Item </CTableHeaderCell>
          <CTableHeaderCell scope="col"> P.U </CTableHeaderCell>
          <CTableHeaderCell scope="col"> Qty </CTableHeaderCell>
          <CTableHeaderCell scope="col"> Total </CTableHeaderCell>
        </CTableHead>
        <CTableBody>
          {orderItems && orderItems.length !== 0 ? (
            orderItems.map((item, index) => (
              <CTableRow>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell className="px-1">
                  {item.quantity +
                    ' ' +
                    item.Product.Packages.filter(
                      (el) => el.id === item.packageId,
                    )[0].name +
                    ' of ' +
                    item.Product.name}
                </CTableDataCell>
                <CTableDataCell className="px-1">
                  {Number(item.ProductPackage.price).toLocaleString()}
                </CTableDataCell>
                <CTableDataCell className="px-1">
                  {Number(item.quantity)}
                </CTableDataCell>
                <CTableDataCell>
                  {Number(
                    item.ProductPackage.price * item.quantity,
                  ).toLocaleString()}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>0 items on order</CTableRow>
          )}
        </CTableBody>
      </CTable>
      <div className="text-center">
        <p>SERVED BY :{user} </p>
        <p>Location :{table ? table : ''} </p>
        <p>*** ENJOY ! ***</p>
        <p>MURAKOZE</p>
        <p>ORDER DATE : {new Date(created).toLocaleDateString()}</p>
      </div>
    </div>
  )
}

function ViewPosBill() {
  const selectedBill = useSelector((state) => state.selection.selected)
  return (
    <div>
      <BackButton />
      <CCardHeader className="text-center">
        <h2>
          <strong> POS BILL {selectedBill.id} </strong>
        </h2>
      </CCardHeader>
      <CCardBody className="bg-white shadow shadow-1 p-4">
        <PosBillView
          user={selectedBill.User.firstName + ' ' + selectedBill.User.lastName}
          orderItems={selectedBill.PosbondecommandeDetails}
          petitStock={selectedBill.PetitStock.name}
          table={selectedBill.table}
          created={selectedBill.date}
        />
      </CCardBody>
    </div>
  )
}

export default ViewPosBill
