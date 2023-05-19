import React, { useState, useRef } from 'react'
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

function removeNullEmptyProperties(obj) {
  const result = {}

  for (let key in obj) {
    if (obj[key] !== null && obj[key] !== '') {
      result[key] = obj[key]
    }
  }

  return result
}

const CreateDailySalesReport = React.forwardRef((props, ref) => {
  const { register, getValues, reset, watch } = useForm()
  const title = watch('title')
  const amount = watch('amount')
  const currency = watch('currency')
  const user = watch('carriedBy')
  let payment = watch('pay')
  const paymentMethod = watch('paymentMethod')
  const componentRef = useRef()
  let [reportItems, setReportItems] = useState([])
  const [visible, setVisible] = useState(false)

  const dontAdd =
    !title ||
    title === '' ||
    !user ||
    user === '' ||
    Object.values(payment).every((value) => value === null || value === '')
      ? true
      : false
  const onAdd = (data) => {
    let newObjects = []
    data = { ...data, carriedBy: user }
    let payments = data.pay
    if (
      payments &&
      Object.values(payments).every((value) => value === null || value === '')
    ) {
      dontAdd = true
    } else if (
      payments &&
      !Object.values(payments).every((value) => value === null || value === '')
    ) {
      payments = removeNullEmptyProperties(payments)
      delete data.pay
      newObjects = Object.keys(payments).map((el) => {
        return {
          ...data,
          paymentMethod: el.split('_')[0],
          currency: el.split('_')[1],
          amount: payments[el],
        }
      })
    }

    console.log('new datas', newObjects)
    setReportItems([...reportItems, ...newObjects])
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
        console.log('err', err)
        toast.error(err.response.message)
      })
  }

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
                      <CFormSelect
                        name="itemName"
                        id="itemName"
                        size="md"
                        className="mb-3"
                        {...register('title')}
                      >
                        <option value="MAIN-BAR[SALES]">MAIN-BAR[SALES]</option>
                        <option value="ACCOMODATION[SALES]">
                          ACCOMODATION[SALES]
                        </option>
                        <option value="HEALTH CLUB SALES">
                          HEALTH CLUB SALES
                        </option>
                        <option value="RECEPTION SALES">RECEPTION SALES</option>
                        <option value="WEDDING CEREMONY">
                          WEDDING CEREMONY
                        </option>
                        <option value="RESERVATION SALES">
                          RESERVATION SALES
                        </option>
                        <option value="RENTING">RENTING</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}>
                      <div className="d-flex justify-content-between">
                        <CFormLabel htmlFor="user">Given by </CFormLabel>
                      </div>
                      <CFormInput
                        type="text"
                        name="user"
                        id="user"
                        placeholder="..."
                        size="md"
                        required
                        {...register('carriedBy')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="cash_RWF"> Cash (RWF) </CFormLabel>
                      <CFormInput
                        type="text"
                        name="amount"
                        id="amount"
                        placeholder="50  "
                        size="md"
                        required
                        {...register('pay.Cash_RWF')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="card_RWF"> Card (RWF) </CFormLabel>
                      <CFormInput
                        type="text"
                        name="amount"
                        id="amount"
                        placeholder="50  "
                        size="md"
                        required
                        {...register('pay.Card_RWF')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="cash_USD"> Cash (USD) </CFormLabel>
                      <CFormInput
                        type="text"
                        name="amount"
                        id="amount"
                        placeholder="50  "
                        size="md"
                        required
                        {...register('pay.Cash_USD')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="card_USD"> Card (USD) </CFormLabel>
                      <CFormInput
                        type="text"
                        name="amount"
                        id="amount"
                        placeholder="50  "
                        size="md"
                        required
                        {...register('pay.Card_USD')}
                      />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel htmlFor="MoMo"> MoMo </CFormLabel>
                      <CFormInput
                        type="text"
                        name="amount"
                        id="amount"
                        placeholder="50  "
                        size="md"
                        required
                        {...register('pay.MoMo_RWF')}
                      />
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
