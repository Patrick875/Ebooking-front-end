import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import BackButton from 'src/components/Navigating/BackButton'
import numberToWords from 'number-to-words'
import EditableTable from 'src/components/EditableTable'
import { initialRows, initialRowsEvents } from 'src/utils/constants'
import { removeObjectsWithEmptyProperties } from 'src/utils/functions'
import { instance } from 'src/API/AxiosInstance'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import EditableTableEvents from 'src/components/EditableTableEvents'
import ReactDatePicker from 'react-datepicker'
import { useNavigate } from 'react-router'

const HotelEventView = (props) => {
  const selectedEvent = useSelector((state) => state.selection.selected)
  const role = useSelector((state) => state.auth.user.Role.name)
  const [data, setData] = useState([
    ...selectedEvent.HotelEventDetails,
    ...initialRowsEvents,
  ])
  const [startDate, setStartDate] = useState(new Date(selectedEvent.startDate))
  const [endDate, setEndDate] = useState(new Date(selectedEvent.endDate))
  const { register, watch } = useForm({
    defaultValues: {
      clientDetails: {
        customerName: selectedEvent.customerName,
        pax: selectedEvent.pax,
        function: selectedEvent.function,
        startDate: new Date(selectedEvent.startDate).getTime(),
        endDate: new Date(selectedEvent.endDate).getTime(),
      },
    },
  })
  let clientDetails = watch('clientDetails')
  const navigate = useNavigate()
  const [readOnly, setReadOnly] = useState(true)
  const updateEvent = async () => {
    const filtereDetails = removeObjectsWithEmptyProperties(data)
    clientDetails = {
      ...clientDetails,
      startDate: new Date(startDate.toString()).getTime(),
      endDate: new Date(endDate.toString()).getTime(),
    }
    await instance
      .put('/events/update', {
        id: selectedEvent.id,
        clientDetails,
        details: filtereDetails,
      })
      .then((res) => {
        setReadOnly(!readOnly)
        if (res.data.data) {
          toast.success('event updated successfuly')
        }
      })
      .catch((err) => {
        setReadOnly(!readOnly)
        console.log('err', err)
      })
  }
  const deleteEvt = async () => {
    await instance
      .post('/events/delete', {
        id: selectedEvent.id,
      })
      .then((res) => {
        if (res.data.data) {
          toast.success('event deleted successfuly')
          navigate(-1)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  return (
    <div className="event-view">
      {Object.keys(selectedEvent).length !== 0 ? (
        <React.Fragment>
          <div>
            <BackButton />
            <div className="d-flex justify-content-end">
              {role === 'admin' || role === 'General Accountant' ? (
                <div className="d-flex gap-2">
                  {!readOnly ? (
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        updateEvent()
                      }}
                    >
                      Submit Update
                    </button>
                  ) : null}

                  <button
                    className="btn btn-ghost-dark"
                    onClick={() => {
                      setReadOnly(!readOnly)
                    }}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-ghost-danger"
                    onClick={() => {
                      deleteEvt()
                    }}
                  >
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="col">
            <p className="text-center my-3 text-uppercase fw-bold">
              {selectedEvent.customerName + ' /' + selectedEvent.function}
            </p>
            <div className="col d-flex flex-row border border-2 border-dark">
              <div className="col p-2 my-0">
                <div className="my-0">
                  <p className="py-0 my-0 d-flex gap-2">
                    Customer Name:{' '}
                    <p className="py-0 my-0 fw-bold">
                      <input
                        style={{
                          border: 'none',
                          background: 'transparent',
                          width: '100%',
                          fontWeight: 'bold',
                        }}
                        defaultValue={selectedEvent.customerName}
                        readOnly={readOnly}
                        type="text"
                      />
                    </p>
                  </p>
                  <div className="py-0 my-0 d-flex gap-2 align-items-center">
                    <div>From </div>
                    <div
                      className="col-3 dates"
                      style={{ background: 'transparent' }}
                    >
                      <ReactDatePicker
                        className="form-control"
                        timeFormat="p"
                        selected={startDate}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        popperPlacement="bottom-end"
                        onChange={(date) => setStartDate(date)}
                        readOnly={readOnly}
                      />
                    </div>

                    <div> to </div>
                    <div className="col-3 dates">
                      <ReactDatePicker
                        className="form-control"
                        timeFormat="p"
                        selected={endDate}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        popperPlacement="bottom-end"
                        onChange={(date) => setEndDate(date)}
                        readOnly={readOnly}
                      />
                    </div>
                  </div>

                  <p className="my-0 d-flex gap-2">
                    Function:
                    <p className="py-0 my-0 fw-bold">
                      <input
                        style={{
                          border: 'none',
                          background: 'transparent',
                          width: '100%',
                          fontWeight: 'bold',
                        }}
                        defaultValue={selectedEvent.function}
                        readOnly={readOnly}
                        type="text"
                      />
                    </p>
                  </p>
                  <p className="my-0 d-flex gap-2 ">
                    Number of Pax:
                    <p className="py-0 my-0 fw-bold">
                      <input
                        style={{
                          border: 'none',
                          background: 'transparent',
                          width: '100%',
                          fontWeight: 'bold',
                        }}
                        defaultValue={selectedEvent.pax}
                        readOnly={readOnly}
                        type="number"
                      />
                    </p>
                  </p>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="col">
                <EditableTableEvents
                  data={[...data]}
                  setData={setData}
                  readOnly={readOnly}
                />
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div>
          <BackButton />
          <p className="fw-bold my-3">No events Today</p>
        </div>
      )}
    </div>
  )
}

export default HotelEventView
