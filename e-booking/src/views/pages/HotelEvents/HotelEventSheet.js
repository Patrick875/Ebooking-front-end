import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import { useRef } from 'react'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import ReactDatePicker from 'react-datepicker'
import CalendarContainer from 'src/utils/CalendarContainer'
import EventSheet from './EventSheet'

const HotelEventSheet = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const [startDate, setStartDate] = useState(new Date())
  const [details, setDetails] = useState()
  const getDetails = (details) => {
    setDetails(details)
  }
  const selectedEvent = useSelector((state) => state.selection.selected)

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
    <div className="my-0 py-0">
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
          <EventSheet
            selectedEvent={selectedEvent}
            getDetails={getDetails}
            printing={true}
            update={{}}
            edit={true}
          />
        </div>
      </div>
      <div>
        <EventSheet
          selectedEvent={selectedEvent}
          getDetails={getDetails}
          printing={false}
          update={{}}
          edit={true}
        />
      </div>
    </div>
  )
})

export default HotelEventSheet
