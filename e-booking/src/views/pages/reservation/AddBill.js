import React from 'react'
import {
  CFormLabel,
  CFormSelect,
  CCol,
  CFormInput,
  CForm,
  CRow,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function AddBill(props) {
  const reservation = useSelector((state) => state.selection.selected)
  const allCustomerBillIds =
    reservation &&
    reservation.CustomerBills &&
    reservation.CustomerBills.length !== 0
      ? reservation.CustomerBills.map(({ id }) => id)
      : []
  const allServiceSellBillIds =
    reservation &&
    reservation.ServiceTransactions &&
    reservation.ServiceTransactions.length !== 0
      ? reservation.ServiceTransactions.map(({ id }) => id)
      : []
  const [services, setServices] = useState([])
  const [bills, setBills] = useState([])
  const { register, handleSubmit, watch } = useForm()
  const billId = watch('billId') || ''
  const service = watch('service') || ''
  const addBillToReservation = async (reservationId, billId) => {
    await instance
      .post('/customerbill/add-to-reservation', {
        id: billId,
        reservationId: reservationId,
      })
      .then((res) => {
        if (res && res.data && res.data.data) {
          toast.success('Bill added to reservation')
          console.log('results', res.data.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const addServiceVaucherToReservation = async (reservationId, billId) => {
    await instance
      .post('/services/vaucher/add-to-reservation', {
        id: billId,
        reservationId: reservationId,
      })
      .then((res) => {
        if (res && res.data && res.data.data) {
          toast.success('Bill added to reservation')
          console.log('results', res.data.data)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //fetching bills
  useEffect(() => {
    const billSearch =
      service && service === 'Bar/Restaurant'
        ? '/customerbill'
        : service === 'other services'
        ? '/services/sells'
        : false
    const getBills = async () => {
      await instance
        .get(`${billSearch}/search?billId=${billId}`)
        .then((res) => {
          if (res && res.data && res.data.data) {
            setBills(res.data.data)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    if (billSearch) {
      getBills()
    }
  }, [billId])
  console.log('bills', bills)

  //fetching initial data
  useEffect(() => {
    const getServiceCategories = async () => {
      await instance
        .get('/services/category/all')
        .then((res) => {
          setServices(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getServiceCategories()
  }, [])

  return (
    <React.Fragment>
      <div>
        <CForm>
          <CRow className="text-center">
            <p className="fw-bold h4">Add Bill</p>
          </CRow>
          <div className="py-2 d-flex gap-3">
            <CCol md={4}>
              <div className="col">
                <CFormLabel htmlFor="service">Service</CFormLabel>
                <CFormSelect
                  name="service"
                  id="service"
                  className="mb-3"
                  {...register('service')}
                >
                  <option value=""></option>
                  <option value="Bar/Restaurant">Bar/Restaurant</option>
                  {services && services.length !== 0
                    ? services.map((service) => (
                        <option value="other services">{service.name}</option>
                      ))
                    : null}
                </CFormSelect>
              </div>
            </CCol>
            <CCol md={4}>
              <CFormLabel htmlFor="billId">Bill Id</CFormLabel>
              <CFormInput
                name="billId"
                id="billId"
                type="text"
                className="mb-3"
                {...register('billId')}
              />
            </CCol>
          </div>
          <CRow>
            {billId === '' && service === 'Bar/Restaurant' ? (
              <div>
                <p>Type to search Bill</p>
              </div>
            ) : bills.length === 0 ? (
              <p>No Bills found</p>
            ) : service === 'Bar/Restaurant' ? (
              <div className=" bills-grid ">
                {bills.map((bill) => (
                  <div
                    className=" view-bill"
                    style={{
                      height: '100%',
                      fontFamily: ' Arial, Helvetica, sans-serif',
                    }}
                  >
                    <div className="d-flex justify-content-center mb-2 py-0">
                      {allCustomerBillIds.includes(bill.id) ? (
                        <p className="text-danger fs-4">ADDED</p>
                      ) : (
                        <button
                          className="px-4 py-1"
                          type="button"
                          onClick={() => {
                            return addBillToReservation(reservation.id, bill.id)
                          }}
                        >
                          Add
                        </button>
                      )}
                    </div>

                    <div className="card px-3 py-1">
                      <p>MOMO Pay CODE : 005685</p>
                      <p> OLYMPIC HOTEL </p>
                      <p>-------------------</p>
                      <p>OLYMPIC HOTEL</p>
                      <p>KIMIRONKO-KIGALI</p>
                      <p>TEL:+250783103500</p>
                      <p>TIN:102556009</p>
                      <p>{new Date(bill.createdAt).toLocaleString('fr-FR')}</p>
                      <p className="my-0 py-0 ">Id: {bill.cbId}</p>
                      <p
                        className="my-1 text-center title"
                        style={{ color: 'black' }}
                      >
                        {' '}
                        CUSTOMER BILL{' '}
                      </p>
                      <table bordered>
                        <thead>
                          <th>#</th>
                          <th> Item </th>
                          <th> P.U </th>
                          <th> Qty </th>
                          <th> Amount </th>
                        </thead>
                        <tbody>
                          {bill.CustomerBillDetails &&
                          bill.CustomerBillDetails.length !== 0 ? (
                            bill.CustomerBillDetails.map((item, index) => (
                              <tr>
                                <td scope="row">{index + 1}</td>
                                <td className="px-1 text-capitalize">
                                  {item.Product.name}
                                </td>
                                <td className="px-1">
                                  {Number(
                                    item.Product.Packages.find(
                                      (pack) => pack.name === item.Package.name,
                                    ).ProductPackage.price,
                                  ).toLocaleString()}
                                </td>
                                <td className="px-1">
                                  {Number(item.quantity)}
                                </td>
                                <td>
                                  {Number(
                                    item.Product.Packages.find(
                                      (pack) => pack.name === item.Package.name,
                                    ).ProductPackage.price * item.quantity,
                                  ).toLocaleString()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>0 items on order</tr>
                          )}
                          <tr>
                            <td />
                            <td className="px-1" colSpan={3}>
                              TOTAL
                            </td>
                            <td className="px-1">
                              {Number(bill.amount).toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="my-0">
                        Served by :
                        {bill.User.firstName + ' ' + bill.User.lastName}{' '}
                      </p>
                      <p className="mt-0 mb-1">
                        Location/Table :{bill.table ? bill.table : ''}{' '}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {billId === '' && service === 'other services' ? (
              <div>
                <p>Type to search vaucher</p>
              </div>
            ) : service === 'other services' && bills.length === 0 ? (
              <p>No vauchers found</p>
            ) : service === 'other services' && bills.length !== 0 ? (
              <div className="bills-grid  ">
                {bills.map((bill) => (
                  <div
                    className="view-bill"
                    style={{
                      height: '100%',
                      fontFamily: ' Arial, Helvetica, sans-serif',
                    }}
                  >
                    <div className="d-flex justify-content-center mb-2 py-0">
                      {allServiceSellBillIds.includes(bill.id) ? (
                        <p className="text-danger fs-4">ADDED</p>
                      ) : (
                        <button
                          className="px-4 py-1"
                          type="button"
                          onClick={() => {
                            return addServiceVaucherToReservation(
                              reservation.id,
                              bill.id,
                            )
                          }}
                        >
                          Add
                        </button>
                      )}
                    </div>

                    <div className="card px-3 py-1">
                      <p>MOMO Pay CODE : 005685</p>
                      <p> OLYMPIC HOTEL </p>
                      <p>-------------------</p>
                      <p>OLYMPIC HOTEL</p>
                      <p>KIMIRONKO-KIGALI</p>
                      <p>TEL:+250783103500</p>
                      <p>TIN:102556009</p>
                      <p>{new Date(bill.createdAt).toLocaleString('fr-FR')}</p>
                      <p className="my-0 py-0 ">Id: {bill.serviceSellId}</p>
                      <p
                        className="my-1 text-center title"
                        style={{ color: 'black' }}
                      >
                        {' '}
                        {bill.ServiceCategory.name} Vaucher
                      </p>
                      <table bordered>
                        <thead>
                          <th> Item </th>
                          <th> P.U </th>
                          <th> Qty </th>
                          <th> Amount </th>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-1 text-capitalize">
                              {bill.Service.name}
                            </td>
                            <td className="px-1">
                              {Number(bill.Service.price).toLocaleString()}
                            </td>
                            <td className="px-1">
                              {Number(bill.total / bill.Service.price)}
                            </td>
                            <td>{Number(bill.total).toLocaleString()}</td>
                          </tr>

                          <tr>
                            <td className="px-1" colSpan={3}>
                              TOTAL
                            </td>
                            <td className="px-1">
                              {Number(bill.total).toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p className="my-0">
                        Served by :
                        {bill.User.firstName + ' ' + bill.User.lastName}{' '}
                      </p>
                      <p className="mt-0 mb-1">
                        Location/Table :{bill.table ? bill.table : ''}{' '}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </CRow>
        </CForm>
      </div>
    </React.Fragment>
  )
}

export default AddBill
