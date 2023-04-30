import React, { useState, useEffect, useRef } from 'react'
import {
  CCard,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import CalendarContainer from 'src/utils/CalendarContainer'
import { datesInRangeWithUnix } from 'src/utils/functions'
import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'
import ReservationsTable from './ReservationsTable'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import Pagination from 'src/utils/Pagination'

const ReservationReport = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, watch } = useForm()
  const filter_condition = watch('filter_condition') || 'All'
  const filter_condition2 = watch('filter_condition2') || 'All'
  const time = watch('time') || 'all-time'
  const query = watch('query') || ''
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  let myDates = datesInRangeWithUnix(startDate, endDate)

  const [reservations, setReservations] = useState([])
  useEffect(() => {
    const getReservations = async () => {
      await instance
        .get('/reservation/all')
        .then((res) => {
          setReservations(res.data.data)
        })
        .catch((err) => {
          console.log('error getting reservations', err.message)
          toast.error(err.message)
        })
    }
    getReservations()
  }, [])
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="">
            <div className="d-flex justify-content-between">
              <div className="col text-center">
                <h4>
                  <strong>Reservations report </strong>
                </h4>
              </div>
              <div>
                <ReactToPrint
                  trigger={() => (
                    <button className="btn btn-ghost-primary">Print</button>
                  )}
                  content={() => ref || componentRef.current}
                />
              </div>
            </div>

            <div className="col row py-2 ">
              <div className="form-control d-flex flex-row py-2 my-2 align align-content-center">
                <form className="col d-flex flex-wrap gap-2">
                  <div className="col-3">
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

          <div style={{ display: 'none' }}>
            <PrintTemplate1
              ref={ref || componentRef}
              title="Reservations report"
            >
              <ReservationsTable
                reservations={reservations}
                filter_condition={filter_condition}
                filter_condition2={filter_condition2}
                time={time}
                myDates={myDates}
                query={query}
              />
            </PrintTemplate1>
          </div>
          <ReservationsTable
            reservations={reservations}
            filter_condition={filter_condition}
            filter_condition2={filter_condition2}
            time={time}
            myDates={myDates}
            query={query}
          />
        </CCard>
      </CCol>
    </CRow>
  )
})

export default ReservationReport
//   <Pagination postsPerPage={10} totalPosts={20} paginate={paginate} />
