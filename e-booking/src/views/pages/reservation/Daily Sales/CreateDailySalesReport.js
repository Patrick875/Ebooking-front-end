import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CRow,
  CCollapse,
} from '@coreui/react'
import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import { instance } from 'src/API/AxiosInstance'
import { currencies } from 'src/utils/constants'
import { Typeahead } from 'react-bootstrap-typeahead'
import { sumAmountsByCurrency } from 'src/utils/functions'
import PrintHeader from '../../Printing/PrintHeader'
import PrintDailyReport from '../../Printing/PrintDailyReport'
import AddElementToReport from './AddElementToReport'

const CreateDailySalesReport = React.forwardRef((props, ref) => {
  const { register, getValues, reset, watch } = useForm()
  const title = watch('title')
  const amount = watch('amount')
  const currency = watch('currency')
  const paymentMethod = watch('paymentMethod')
  const componentRef = useRef()
  let [reportItems, setReportItems] = useState([])
  const [visible, setVisible] = useState(false)
  let [users, setUsers] = useState([])
  const [user, setUser] = useState([])
  const dontAdd =
    !title ||
    title === '' ||
    !amount ||
    amount === '' ||
    !currency ||
    currency === '' ||
    !paymentMethod ||
    paymentMethod === '' ||
    !user ||
    user.length === 0
      ? true
      : false
  const onAdd = (data) => {
    data = { ...data, carriedBy: user[0].id }
    setReportItems([...reportItems, data])
    reset()
  }

  let totals = sumAmountsByCurrency(reportItems)
  const submitDailyReport = async () => {
    console.log('the daily sales data', { data: reportItems, totals })
    await instance
      .post('/daily-sales/add', { data: reportItems, totals })
      .then(() => {
        toast.success('report successfuly submited')
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.response.message)
      })
  }

  useEffect(() => {
    const getAllUsers = async () => {
      await instance.get('/users/all').then((res) => {
        setUsers(res.data.users)
      })
    }
    getAllUsers()
  }, [])

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between">
                <h3>
                  <strong> Daily Sales Report </strong>
                </h3>
                <CButton
                  component="input"
                  value="Add items to list "
                  onClick={() => {
                    return setVisible(!visible)
                  }}
                />

                {reportItems && reportItems.length !== 0 ? (
                  <div className="d-flex gap-2">
                    <ReactToPrint
                      trigger={() => (
                        <button className="btn btn-ghost-primary">Print</button>
                      )}
                      content={() => ref || componentRef.current}
                    />
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        return setReportItems([])
                      }}
                    >
                      Clear list
                    </button>
                  </div>
                ) : null}
              </div>
            </CCardHeader>
            <CCollapse visible={visible}>
              <CCardBody>
                <CForm name="roomClassAddFrm" encType="multipart/form">
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <div className="d-flex justify-content-between">
                        <CFormLabel htmlFor="name"> Designation </CFormLabel>
                      </div>

                      <CFormInput
                        type="text"
                        name="designation"
                        id="designation"
                        placeholder="item name  "
                        size="md"
                        required
                        {...register('title')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <div className="d-flex justify-content-between">
                        <CFormLabel htmlFor="user">From </CFormLabel>
                      </div>

                      <Typeahead
                        id="basic-typeahead-single"
                        filterBy={['firstName']}
                        labelKey="firstName"
                        onChange={setUser}
                        options={users}
                        placeholder="user name ..."
                        selected={user}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="name"> Amount </CFormLabel>
                      <CFormInput
                        type="text"
                        name="amount"
                        id="amount"
                        placeholder="50  "
                        size="md"
                        required
                        {...register('amount')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="paymentMethod">
                        {' '}
                        Payment method{' '}
                      </CFormLabel>
                      <CFormSelect
                        name="paymentMethod"
                        id="paymentMethod"
                        size="md"
                        className="mb-3"
                        {...register('paymentMethod')}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Mobile Money">Mobile Money</option>
                        <option value="Credit card">Credit card</option>
                        <option value="Credit">Credit</option>
                        <option value="Cheque">Cheque</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="paymentCurrency">
                        Currency
                      </CFormLabel>
                      <CFormSelect
                        name="paymentCurrency"
                        id="currency"
                        size="md"
                        className="mb-3"
                        defaultValue={'RWF'}
                        {...register('currency')}
                      >
                        {Object.keys(currencies).map((curr, i) => (
                          <option value={curr} key={i + 1}>
                            {curr} :{currencies[curr]}{' '}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CCol xs={12}>
                    {user && user.length === 0 ? (
                      <p className="text-danger fs-6 fw-bold">
                        Please indicate the user{' '}
                      </p>
                    ) : null}
                    <CButton
                      component="input"
                      value="Add element"
                      disabled={dontAdd}
                      onClick={() => {
                        const data = getValues()
                        return onAdd(data)
                      }}
                    />
                  </CCol>
                </CForm>
              </CCardBody>
            </CCollapse>
            <CRow>
              <CCol xs={12}>
                <CCard className="mb-4">
                  <div style={{ display: 'none' }}>
                    <div className="m-3 p-0" ref={ref || componentRef}>
                      <PrintHeader />
                      <p className="fs-4 fw-bolder text-center my-1">
                        {' '}
                        Daily sales report{' '}
                      </p>

                      <AddElementToReport
                        user={user}
                        reportItems={reportItems}
                        setReportItems={setReportItems}
                        totals={totals}
                      />
                      <PrintDailyReport />
                    </div>
                  </div>

                  <CCardHeader>
                    <h3>
                      <strong> Daily Sales report </strong>
                    </h3>
                  </CCardHeader>
                  <AddElementToReport
                    user={user}
                    reportItems={reportItems}
                    setReportItems={setReportItems}
                    totals={totals}
                  />

                  {reportItems && reportItems.length !== 0 ? (
                    <CCol xs={12}>
                      <CButton
                        component="input"
                        value="Submit Report"
                        onClick={submitDailyReport}
                      />
                    </CCol>
                  ) : null}
                </CCard>
              </CCol>
            </CRow>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
})

export default CreateDailySalesReport
