import React from 'react'
import { useState } from 'react'
import { GrAdd } from 'react-icons/gr'
import { useDispatch, useSelector } from 'react-redux'
import EventSheet from './EventSheet'
import HotelEventSheet from './HotelEventSheet'
import { useEffect } from 'react'
import { selectEventSheet } from 'src/redux/Select/selectionActions'
import ReactToPrint from 'react-to-print'
import { useRef } from 'react'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ViewEventSheets = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const selectedEvent = useSelector((state) => state.selection.selected)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [details, setDetails] = useState()
  const [create, setCreate] = useState(false)
  const [edit, setEdit] = useState(false)
  const eventSheets =
    selectedEvent.HotelEventSheets.length !== 0
      ? selectedEvent.HotelEventSheets
      : []

  const [selectedEventSheet, setSelectedEventSheet] = useState({})
  const getDetails = (details) => {
    setDetails(details)
  }
  const updateEventSheet = async (id) => {
    await instance
      .put('/events/event-sheet-update', { id, details })
      .then((res) => {
        if (res && res.data && res.data.data) {
          toast.success('Updated !!!!')
          console.log('resulting', res.data)
          setEdit(false)
          navigate(-1)
        }
      })
      .catch((err) => {
        setEdit(false)
        console.log('err', err)
      })
  }
  const deleteEventSheet = async (id) => {
    await instance
      .post('/events/delete-sheet', { id })
      .then((res) => {
        if (res && res.data && res.data.data) {
          toast.success('Deleted !!!')
          setEdit(false)
          navigate(-1)
        }
      })
      .catch((err) => {
        console.log('err', err)
        setEdit(false)
      })
  }
  useEffect(() => {}, [selectedEventSheet])
  return (
    <div>
      <div className="event-sheets">
        <div className="d-flex gap-2">
          <div
            className="px-3 my-0 py-0 border rounded-2 shadow d-flex justify-content-center align-items-center"
            type="button"
            onClick={() => {
              setCreate(true)
              setSelectedEventSheet({})
            }}
          >
            <GrAdd />
          </div>
          {selectedEventSheet &&
          Object.keys(selectedEventSheet).length !== 0 ? (
            <div
              className=" px-3 text-white d-flex justify-content-center align-items-center  rounded-2 shadow"
              style={{ backgroundColor: 'black' }}
              onClick={() => {
                if (edit) {
                  setEdit(false)
                } else {
                  setEdit(true)
                }
              }}
            >
              {edit ? 'Updating....' : 'Update'}
            </div>
          ) : null}
        </div>
        <div className="d-flex gap-2 ">
          {eventSheets && eventSheets.length === 0
            ? null
            : eventSheets
                .sort((a, b) => a.id - b.id)
                .map((el) => (
                  <div
                    key={el.id}
                    className="d-flex justify-content-center align-items-center bg-white rounded-2 shadow "
                    type="button"
                    onClick={() => {
                      setSelectedEventSheet(el)
                      dispatch(selectEventSheet(el))
                      setCreate(false)
                    }}
                  >
                    <p className="px-2 text-center fw-bold align-middle">
                      {new Date(el.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
        </div>
        <div className="d-flex gap-2">
          {!create ? (
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary px-2">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          ) : null}
          {selectedEventSheet &&
          Object.keys(selectedEventSheet).length !== 0 ? (
            <button
              className="buttons-new px-2 bg-danger btn-outline-danger shadow shadow-2 border-0 "
              onClick={() => {
                deleteEventSheet(selectedEventSheet.id)
              }}
            >
              Delete
            </button>
          ) : null}
          {selectedEventSheet &&
          Object.keys(selectedEventSheet).length !== 0 &&
          edit ? (
            <button
              className="buttons-new px-2 bg-success btn-outline-success shadow shadow-2 border-0"
              onClick={() => {
                updateEventSheet(selectedEventSheet.id)
              }}
            >
              Save{' '}
            </button>
          ) : null}
        </div>
      </div>
      {!create &&
      selectedEventSheet &&
      Object.keys(selectedEventSheet).length !== 0 ? (
        <div ref={componentRef || ref}>
          <EventSheet
            selectedEvent={selectedEvent}
            getDetails={getDetails}
            printing={true}
            eventSheet={selectedEventSheet}
            edit={edit}
          />
        </div>
      ) : null}
      {create ? <HotelEventSheet /> : null}
    </div>
  )
})

export default ViewEventSheets
