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
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CCollapse,
} from '@coreui/react'
import { toast } from 'react-hot-toast'
import ReactToPrint from 'react-to-print'
import { instance } from 'src/API/AxiosInstance'
import { currencies } from 'src/utils/constants'
import { Typeahead } from 'react-bootstrap-typeahead'

const AddElementToReport = (props) => {
  const [show, setShow] = useState(false)
  const { reportItems, setReportItems, user } = props
  let total =
    reportItems && reportItems.length !== 0
      ? reportItems.reduce((acc, next) => acc + next.amount, 0)
      : null

  return (
    <div>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col"> Element </CTableHeaderCell>
              <CTableHeaderCell scope="col"> From (name) </CTableHeaderCell>
              <CTableHeaderCell scope="col"> Payment method </CTableHeaderCell>
              <CTableHeaderCell scope="col"> Currency </CTableHeaderCell>
              <CTableHeaderCell scope="col"> Amount </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {reportItems && reportItems.length !== 0 ? (
              <React.Fragment>
                {reportItems.map((added, index) => {
                  return (
                    <CTableRow
                      key={index + 1}
                      onMouseEnter={() => {
                        setShow(true)
                      }}
                      onMouseLeave={() => {
                        setShow(false)
                      }}
                    >
                      <CTableHeaderCell scope="row">
                        {' '}
                        {index + 1}{' '}
                      </CTableHeaderCell>
                      <CTableDataCell> {added.title} </CTableDataCell>
                      <CTableDataCell>
                        {' '}
                        {user && user.length !== 0
                          ? user[0].firstName + ' ' + user[0].lastName
                          : null}{' '}
                      </CTableDataCell>
                      <CTableDataCell>{added.paymentMethod} </CTableDataCell>
                      <CTableDataCell> {added.currency} </CTableDataCell>
                      <CTableDataCell>
                        {added.amount}

                        {show ? (
                          <div
                            className="btn btn-danger btn-sm ms-2"
                            onClick={() => {
                              setReportItems(
                                reportItems.filter((item) =>
                                  item !== added ? item : null,
                                ),
                              )
                            }}
                          >
                            Delete item
                          </div>
                        ) : null}
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
                <CTableRow key={reportItems.length}>
                  <CTableHeaderCell scope="row"></CTableHeaderCell>
                  <CTableHeaderCell> Total </CTableHeaderCell>
                  <CTableDataCell />
                  <CTableDataCell />
                  <CTableDataCell>
                    {Number(total).toLocaleString()} RWF
                  </CTableDataCell>
                </CTableRow>
              </React.Fragment>
            ) : (
              <div className="text-center"> No items added</div>
            )}
          </CTableBody>
        </CTable>
      </CCardBody>
    </div>
  )
}

const CreateDailySalesReport = React.forwardRef((props, ref) => {
  const { register, getValues, reset } = useForm()
  const componentRef = useRef()
  let [reportItems, setReportItems] = useState([])
  const [visible, setVisible] = useState(false)
  let [users, setUsers] = useState([])
  const [user, setUser] = useState([])
  const onAdd = (data) => {
    console.log('daily sales report items')
    data = { ...data, carriedBy: user[0].id }
    setReportItems([...reportItems, data])
    reset()
  }

  const submitDailyReport = async () => {
    await instance
      .post('/daily-sales/add', { data: reportItems })
      .then(() => {
        toast.success('report successfuly submited')
        setReportItems([])
      })
      .catch((err) => {
        toast.error(err.response.message)
        setReportItems([])
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
                  <ReactToPrint
                    trigger={() => (
                      <button className="btn btn-ghost-primary">Print</button>
                    )}
                    content={() => ref || componentRef.current}
                  />
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
                      disabled={user && user.length === 0 ? true : false}
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
                    <AddElementToReport
                      reportItems={reportItems}
                      setReportItems={setReportItems}
                    />
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

// onClick={() => {
//                           console.log(receivedItems)
//                           setReceivedItems([])
//                           setVisible(!visible)
//                           setOrder([])
//                           return onAddItemToStock(receivedItems)
//                         }}
