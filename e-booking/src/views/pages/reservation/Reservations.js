import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CFormLabel,
  CFormInput,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { selectItem } from 'src/redux/Select/selectionActions'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import AddPaymentModal from './AddPaymentModal'
import Pagination from 'src/utils/Pagination'
import { useForm } from 'react-hook-form'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
} from 'src/utils/functions'
import DatePicker from 'react-datepicker'
import CalendarContainer from 'src/utils/CalendarContainer'

const Reservation = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [clicked, setClicked] = useState({})
  let [reservations, setReservations] = useState([])
  const [open, setOpen] = useState(false)
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const { register, watch } = useForm()
  const filter_condition = watch('filter_condition') || 'All'
  const filter_condition2 = watch('filter_condition2') || 'All'
  const time = watch('time') || 'all-time'
  const query = watch('query') || ''
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  let myDates = datesInRangeWithUnix(startDate, endDate)

  const searchReservByCustomerName = (reservations, query) => {
    if (reservations.length !== 0 && query) {
      return reservations.filter((reserv) =>
        reserv.Customer.names.toLowerCase().includes(query.toLowerCase())
          ? reserv
          : null,
      )
    }
    return []
  }

  if (reservations.length !== 0) {
    if (filter_condition === 'All' && filter_condition2 === 'All') {
      if (time && time === 'all-time') {
      } else if (myDates && myDates.length !== 0) {
        reservations = reservations.filter((reserv) =>
          myDates.includes(
            getUTCDateWithoutHours(reserv.createdAt) ? reserv : null,
          ),
        )
      }
    } else if (filter_condition2 === 'All' && filter_condition !== 'All') {
      if (time && time === 'all-time') {
        reservations = reservations.filter((reserv) =>
          reserv.status === filter_condition ? reserv : null,
        )
      } else if (myDates && myDates.length !== 0) {
        reservations = reservations.filter((reserv) =>
          myDates.includes(
            getUTCDateWithoutHours(reserv.createdAt) &&
              reserv.status === filter_condition
              ? reserv
              : null,
          ),
        )
      }
    } else if (filter_condition2 === 'room') {
      if (time && time === 'all-time') {
        reservations = reservations.filter((reserv) =>
          (reserv.status === filter_condition || filter_condition === 'All') &&
          reserv.roomId
            ? reserv
            : null,
        )
      } else if (myDates && myDates.length !== 0) {
        reservations = reservations.filter((reserv) =>
          myDates.includes(getUTCDateWithoutHours(reserv.createdAt)) &&
          (reserv.status === filter_condition || filter_condition === 'All') &&
          reserv.roomId
            ? reserv
            : null,
        )
      }
    } else {
      if (time && time === 'all-time') {
        reservations = reservations.filter((reserv) =>
          (reserv.status === filter_condition || filter_condition === 'All') &&
          reserv.hallId
            ? reserv
            : null,
        )
      } else if (myDates && myDates.length !== 0) {
        reservations = reservations.filter((reserv) =>
          myDates.includes(getUTCDateWithoutHours(reserv.createdAt)) &&
          (reserv.status === filter_condition || filter_condition === 'All') &&
          reserv.hallId
            ? reserv
            : null,
        )
      }
    }

    reservations =
      query && query !== ''
        ? searchReservByCustomerName(reservations, query)
        : reservations

    if (query && query !== 0) {
    }
  }

  const handleOnRowClick = async (item) => {
    dispatch(selectItem(item))
    navigate('/booking/reservations/info')
  }
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const changeReservationStatus = async (data, action) => {
    await instance
      .put('/reservation/update', data)
      .then((res) => {
        console.log(res.data)
        toast.success(`Reservation ${action} success`)
      })
      .catch((err) => {
        toast.error(`Reservation ${action} failed`)
      })
  }
  useEffect(() => {
    const getReservations = async () => {
      await instance
        .get('/reservation/all')
        .then((res) => {
          setReservations(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getReservations()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2 className="text-center">
              <strong> All Reservations </strong>
            </h2>
            <div className="col row py-2 ">
              <div className="form-control d-flex flex-row py-2 my-2 align align-content-center">
                <form className="col d-flex flex-wrap gap-2">
                  <div className="col-2">
                    <CFormLabel className="text-center">Search</CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="customerName"
                      id="customerName"
                      size="md"
                      placeholder="by customer ..."
                      {...register('query')}
                    />
                  </div>

                  <div className="col-3">
                    <label className="text-center py-1">Status </label>
                    <select
                      className="form-select form-select-sm col"
                      aria-label="Default select example"
                      defaultValue={'All'}
                      {...register('filter_condition')}
                    >
                      <option value="All">All</option>
                      <option value="in progress">In progress</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="canceled">Canceled</option>
                    </select>
                  </div>
                  <div className="col-3">
                    <label className="text-center py-1">Service </label>
                    <select
                      className="form-select form-select-sm col"
                      aria-label="Default select example"
                      defaultValue={'All'}
                      {...register('filter_condition2')}
                    >
                      <option value="All">All</option>
                      <option value="room">Room</option>
                      <option value="hall">Hall</option>
                    </select>
                  </div>
                  <div className="col d-flex gap-2 flex-wrap">
                    <div className="col">
                      <label className="text-center py-1">Time</label>
                      <select
                        className="form-select form-select-sm col"
                        aria-label="Default select example"
                        defaultValue={'all-time'}
                        {...register('time')}
                      >
                        <option value="all-time">All-time</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                    {time && time === 'date' ? (
                      <div className="col d-flex align-items-end ">
                        <DatePicker
                          className="form-control col px-2"
                          onChange={onChange}
                          startDate={startDate}
                          endDate={endDate}
                          dateFormat="dd/MM/yy"
                          selectsRange
                          portalId="root-portal"
                          popperPlacement="bottom-end"
                          popperContainer={CalendarContainer}
                          placeholderText="Select date range"
                        />
                      </div>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable bordered hover={true}>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Names </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> created by </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Check in </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Check out </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Status </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Options </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {reservations && reservations.length !== 0
                  ? reservations
                      .filter((el, i) => {
                        if (currentPage === 1) {
                          return i >= 0 && i < perpage ? el : null
                        } else {
                          return i >= (currentPage - 1) * perpage &&
                            i <= perpage * currentPage - 1
                            ? el
                            : null
                        }
                      })
                      .map((reserv, i) => (
                        <CTableRow key={reserv.id}>
                          <CTableHeaderCell scope="row">
                            {(currentPage - 1) * perpage + 1 + i}
                          </CTableHeaderCell>
                          <CTableDataCell>
                            {' '}
                            <p
                              onClick={() => {
                                return handleOnRowClick(reserv)
                              }}
                            >
                              {reserv.Customer.names}{' '}
                            </p>{' '}
                            {Number(reserv.amount['RWF']) >
                            Number(reserv.payment['RWF']) ? (
                              <CBadge
                                type="button"
                                color="danger"
                                onClick={() => {
                                  setClicked(reserv)
                                  return setOpen(true)
                                }}
                              >
                                {' '}
                                Debt
                              </CBadge>
                            ) : null}
                          </CTableDataCell>

                          <CTableDataCell>
                            {' '}
                            {reserv.User.firstName + ' ' + reserv.User.lastName}
                          </CTableDataCell>
                          <CTableDataCell>
                            {' '}
                            {new Date(reserv.checkIn).toLocaleString()}
                          </CTableDataCell>
                          <CTableDataCell>
                            {' '}
                            {new Date(reserv.checkOut).toLocaleString()}{' '}
                          </CTableDataCell>
                          <CTableDataCell>
                            {reserv.status ? reserv.status : 'in progress'}{' '}
                          </CTableDataCell>
                          <CTableDataCell>
                            {reserv.status && reserv.status !== 'confirmed' ? (
                              <Link
                                className="badge badge-warning text-secondary text-decoration-none"
                                onClick={() =>
                                  changeReservationStatus(
                                    {
                                      id: reserv.id,
                                      status: 'confirmed',
                                    },
                                    'confirm',
                                  )
                                }
                              >
                                {' '}
                                Confirm{' '}
                              </Link>
                            ) : null}

                            {reserv.status && reserv.status !== 'canceled' ? (
                              <Link
                                className="badge badge-danger text-danger text-decoration-none"
                                onClick={() =>
                                  changeReservationStatus(
                                    {
                                      id: reserv.id,
                                      status: 'canceled',
                                    },
                                    'cancel',
                                  )
                                }
                              >
                                {' '}
                                Cancel{' '}
                              </Link>
                            ) : null}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                  : null}
                <AddPaymentModal
                  open={open}
                  reservation={clicked}
                  setOpen={setOpen}
                />
              </CTableBody>
            </CTable>
          </CCardBody>
          {reservations ? (
            <Pagination
              postsPerPage={perpage}
              totalPosts={reservations.length}
              paginate={paginate}
            />
          ) : null}
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Reservation
