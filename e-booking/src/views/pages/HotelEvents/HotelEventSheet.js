import React, { useState } from 'react'
import InvoiceHeader from '../Printing/InvoiceHeader'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import ReactDatePicker from 'react-datepicker'
import CalendarContainer from 'src/utils/CalendarContainer'

const HotelEventSheet = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const { register, watch } = useForm()
  const [startDate, setStartDate] = useState(new Date())
  const details = watch('details') || ''
  const selectedEvent = useSelector((state) => state.selection.selected)
  const user = useSelector(
    (state) => state.auth.user.firstName + '  ' + state.auth.user.firstName,
  )
  const role = useSelector((state) => state.auth.role)
  const saveEventSheet = async () => {
    await instance
      .post('/events/event-sheet-add', {
        eventId: selectedEvent.id,
        details,
        date: startDate,
      })
      .then((res) => {
        if (res && res.data && res.data.data) {
          toast.success('saved')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="d-flex gap-2 align-content-center my-2">
          <label className="text-center pt-2 fw-bold">Date</label>
          <ReactDatePicker
            className=" form-control col px-2"
            onChange={(date) => setStartDate(date)}
            selected={startDate}
            dateFormat="dd/MM/yy"
            portalId="root-portal"
            popperPlacement="bottom-end"
            popperContainer={CalendarContainer}
            placeholderText="Select date "
          />
        </div>
        <div className="d-flex gap-2">
          <button
            className="button-new "
            style={{ backgroundColor: 'black', color: 'white' }}
            onClick={() => {
              saveEventSheet()
            }}
          >
            Save
          </button>
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost-primary">Print</button>
            )}
            content={() => ref || componentRef.current}
          />
        </div>
      </div>

      <div style={{ display: 'none' }}>
        <div ref={componentRef || ref}>
          <InvoiceHeader />
          <p className="text-center fs-5 fw-bold text-decoration-underline">
            EVENT SHEET
          </p>
          <div className="event-sheet ms-2">
            <p>company : {selectedEvent.customerName}</p>
            <p>Date : {new Date().toLocaleDateString('fr-FR')}</p>
            <p>function : {selectedEvent.function}</p>
            <p>venue : {selectedEvent.location}</p>
            <p>number of pax : {selectedEvent.pax}</p>
          </div>
          <div className="ms-2">
            <p className="event-sheet text-decoration-underline">reservation</p>
            <textarea className=" event-text-print col-8" value={details} />
          </div>
          <div className="event-sheet">
            <p>Prepared by {user}</p>
            <p> {role}</p>
          </div>
          Printed on: {new Date().toLocaleDateString('fr-FR')}
        </div>
      </div>
      <div>
        <InvoiceHeader />
        <p className="text-center fs-5 fw-bold text-decoration-underline">
          EVENT SHEET
        </p>
        <div className="event-sheet ms-2">
          <p>company : {selectedEvent.customerName}</p>
          <p>Date : {new Date().toLocaleDateString('fr-FR')}</p>
          <p>function : {selectedEvent.function}</p>
          <p>venue : {selectedEvent.location}</p>
          <p>number of pax : {selectedEvent.pax}</p>
        </div>
        <div className="ms-2">
          <p className="event-sheet text-decoration-underline">reservation</p>
          <textarea
            placeholder="Add details "
            className=" event-text col-8"
            {...register('details')}
          />
        </div>
        <div className="event-sheet">
          <p>Prepared by {user}</p>
          <p> {role}</p>
        </div>
      </div>
    </div>
  )
})

export default HotelEventSheet
