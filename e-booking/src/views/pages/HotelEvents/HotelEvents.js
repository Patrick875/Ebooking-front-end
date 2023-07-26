import { CCard, CCardBody, CCardText, CCardTitle } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import CreateHotelEvent from './CreateHotelEvent'
import { caterings } from 'src/utils/constants'
import ReactDatePicker from 'react-datepicker'
import { getEventDates } from 'src/utils/functions'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { selectItem } from 'src/redux/Select/selectionActions'

function HotelEvents() {
  const [halls, setHalls] = useState([])
  let [events, setEvents] = useState([])
  const [create, setCreate] = useState(false)
  const dispatch = useDispatch()
  const [selectedLocation, setSelectedLocation] = useState()
  const [date, setDate] = useState(new Date())
  const allEventDates =
    getEventDates(events).length !== 0
      ? getEventDates(events).map((el) => {
          let dates = el.dates.map((dt) => dt.toLocaleDateString('fr-FR'))
          return { ...el, dates: dates }
        })
      : []

  const navigate = useNavigate()
  const addButton = (el) => (
    <p
      type="button"
      onClick={() => {
        setCreate(true)
        setSelectedLocation({ id: el.id, name: el.name })
      }}
      className="bg-primary py-1 px-4 btn rounded-0 text-white my-1"
    >
      Add
    </p>
  )
  const daysEvents = allEventDates.filter((evnt) =>
    evnt.dates.includes(date.toLocaleDateString('fr-FR')),
  )

  const [todayEvents, setTodayEvents] = useState(daysEvents)

  const locationEvent = (el) => {
    return (
      <div>
        <p className="py-2 my-2 ">
          {daysEvents.filter(
            (ev) =>
              ev.location.trim().toLowerCase() === el.name.trim().toLowerCase(),
          ).length !== 0
            ? daysEvents.filter(
                (ev) =>
                  ev.location.trim().toLowerCase() ===
                  el.name.trim().toLowerCase(),
              )[0].customerName +
              '/' +
              daysEvents.filter(
                (ev) =>
                  ev.location.trim().toLowerCase() ===
                  el.name.trim().toLowerCase(),
              )[0].function
            : ''}
        </p>
        <p>
          {daysEvents.filter(
            (ev) =>
              ev.location.trim().toLowerCase() === el.name.trim().toLowerCase(),
          ).length !== 0
            ? new Date(
                daysEvents.filter(
                  (ev) =>
                    ev.location.trim().toLowerCase() ===
                    el.name.trim().toLowerCase(),
                )[0].startDate,
              ).toLocaleDateString('fr-FR') +
              ' to ' +
              new Date(
                daysEvents.filter(
                  (ev) =>
                    ev.location.trim().toLowerCase() ===
                    el.name.trim().toLowerCase(),
                )[0].endDate,
              ).toLocaleDateString('fr-FR')
            : ''}
        </p>
      </div>
    )
  }
  useEffect(() => {
    const getHalls = async () => {
      await instance
        .get('/halls/all')
        .then((res) => {
          setHalls(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    const getEvents = async () => {
      await instance
        .get('/events/all')
        .then((res) => {
          setEvents(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getEvents()
    getHalls()
  }, [])

  return (
    <React.Fragment>
      {create ? (
        <CreateHotelEvent
          halls={[...halls, ...caterings]}
          name={selectedLocation.name}
          id={selectedLocation.id ? selectedLocation.id : 'catering'}
          setCreate={setCreate}
        />
      ) : (
        <div>
          <div className="d-flex justify-content-between my-2 ">
            <div className="col">
              <p className="fw-bold">Events</p>
            </div>
            <div className="col-5">
              <ReactDatePicker
                className="form-control"
                timeFormat="p"
                selected={date}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                popperPlacement="bottom-end"
                onChange={(date) => setDate(date)}
                placeholderText="Select a date "
              />
            </div>
          </div>
          <div className="locations">
            {halls.map((el) => (
              <CCard key={el.id}>
                <CCardBody>
                  <CCardTitle
                    className="text-center"
                    onClick={() => {
                      navigate('/booking/events/view')
                      let events =
                        daysEvents.filter(
                          (ev) =>
                            ev.location.trim().toLowerCase() ===
                            el.name.trim().toLowerCase(),
                        ).length !== 0

                      if (events) {
                        dispatch(
                          selectItem(
                            daysEvents.filter(
                              (ev) =>
                                ev.location.trim().toLowerCase() ===
                                el.name.trim().toLowerCase(),
                            )[0],
                          ),
                        )
                      } else {
                        dispatch(selectItem({}))
                      }
                    }}
                  >
                    {el.name}
                  </CCardTitle>
                  <CCardText
                    className="text-center my-1 "
                    onClick={() => {
                      navigate('/booking/events/view')
                      let events =
                        daysEvents.filter(
                          (ev) =>
                            ev.location.trim().toLowerCase() ===
                            el.name.trim().toLowerCase(),
                        ).length !== 0

                      if (events) {
                        dispatch(
                          selectItem(
                            daysEvents.filter(
                              (ev) =>
                                ev.location.trim().toLowerCase() ===
                                el.name.trim().toLowerCase(),
                            )[0],
                          ),
                        )
                      } else {
                        dispatch(selectItem({}))
                      }
                    }}
                  >
                    {locationEvent(el)}
                  </CCardText>
                  <div className=" col d-flex justify-content-center">
                    {addButton(el)}
                  </div>
                </CCardBody>
              </CCard>
            ))}
            {caterings.map((el, i) => (
              <CCard key={i * 123456}>
                <CCardBody>
                  <CCardTitle className="text-center">{el.name}</CCardTitle>
                  <CCardText
                    className="text-center my-1 "
                    onClick={() => {
                      navigate('/booking/events/view')
                      let events =
                        daysEvents.filter(
                          (ev) =>
                            ev.location.trim().toLowerCase() ===
                            el.name.trim().toLowerCase(),
                        ).length !== 0

                      if (events) {
                        dispatch(
                          selectItem(
                            daysEvents.filter(
                              (ev) =>
                                ev.location.trim().toLowerCase() ===
                                el.name.trim().toLowerCase(),
                            )[0],
                          ),
                        )
                      } else {
                        dispatch(selectItem({}))
                      }
                    }}
                  >
                    {locationEvent(el)}
                  </CCardText>
                  <div className=" col d-flex justify-content-center">
                    {addButton({ name: el.name })}
                  </div>
                </CCardBody>
              </CCard>
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

export default HotelEvents
