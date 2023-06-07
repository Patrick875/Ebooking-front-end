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

const CustomerBillView = (props) => {
  const { user, orderItems, table } = props
  return (
    <div>
      <div className="text-center">
        <p className="py-0 my-0">MOMO Pay CODE : 005685 // OLYMPIC HOTEL</p>
        <p className="py-0 my-0">-------------------</p>
        <p className="py-0 my-0">OLYMPIC HOTEL</p>
        <p className="py-0 my-0">KIMIRONKO-KIGALI</p>
        <p className="py-0 my-0">TEL:+250783103500</p>
        <p className="py-0 my-0">TIN:102556009</p>
        <p className="py-0 my-0">{new Date().toLocaleString()}</p>
        <p className="py-1 my-1">CUSTOMER BILL</p>
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
                  {Number(
                    item.Product.Packages.filter(
                      (el) => el.id === item.packageId,
                    )[0].ProductPackage.price,
                  ).toLocaleString()}
                </CTableDataCell>
                <CTableDataCell className="px-1">
                  {Number(item.quantity)}
                </CTableDataCell>
                <CTableDataCell>
                  {Number(
                    item.Product.Packages.filter(
                      (el) => el.id === item.packageId,
                    )[0].ProductPackage.price * item.quantity,
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
        <p>NOT OFFICAL RECEIPT</p>
        <p>PLEASE WAIT FOR YOUR EBM</p>
        <p>MURAKOZE</p>
        <p>-----------------</p>
      </div>
    </div>
  )
}

function ViewCustomerBill() {
  const selectedBill = useSelector((state) => state.selection.selected)
  console.log('customer bill', selectedBill)
  return (
    <div>
      <BackButton />
      <CCardHeader className="text-center">
        <h2>
          <strong> CUSTOMER BILL {selectedBill.id} </strong>
        </h2>
      </CCardHeader>
      <CCardBody className="bg-white shadow shadow-1 p-4">
        <CustomerBillView
          user={selectedBill.User.firstName + ' ' + selectedBill.User.lastName}
          orderItems={selectedBill.CustomerBillDetails}
          petitStock={selectedBill.PetitStock.name}
          table={selectedBill.table}
        />
      </CCardBody>
    </div>
  )
}

export default ViewCustomerBill
