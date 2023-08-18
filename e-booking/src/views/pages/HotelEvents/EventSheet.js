import React, { useEffect, useState } from 'react'
import InvoiceHeader from '../Printing/InvoiceHeader'
import { useSelector } from 'react-redux'

function EventSheet(props) {
  const {
    selectedEvent,
    getDetails,
    printing,
    eventSheet,
    edit,
    detailsPrint,
  } = props
  const user = useSelector(
    (state) => state.auth.user.firstName + '  ' + state.auth.user.firstName,
  )
  const sheet = useSelector((state) => state.selection.selectedEventSheet)
  const role = useSelector((state) => state.auth.role)
  const [details, setDetails] = useState(eventSheet ? sheet.details : '')
  const onDetailsChange = (e) => {
    const { value } = e.target
    setDetails(value)
  }
  const allowTabsInTextField = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault() // Prevent the default tab behavior

      const target = e.target
      const start = target.selectionStart
      const end = target.selectionEnd

      // Insert a tab character at the cursor position
      target.value =
        target.value.substring(0, start) + '\t' + target.value.substring(end)

      // Move the cursor position to after the inserted tab
      target.selectionStart = target.selectionEnd = start + 1
    }
  }

  useEffect(() => {
    getDetails(details)
  }, [details, getDetails])
  return (
    <div>
      <InvoiceHeader />
      <p className="text-center fs-5 fw-bold text-decoration-underline">
        EVENT SHEET
      </p>
      <div className="event-sheet ms-2">
        <p>company : {selectedEvent.customerName}</p>
        <p>
          Date :{' '}
          {eventSheet
            ? new Date(eventSheet.date).toLocaleDateString('fr-FR')
            : new Date().toLocaleDateString('fr-FR')}
        </p>
        <p>function : {selectedEvent.function}</p>
        <p>venue : {selectedEvent.location}</p>
        <p>number of pax : {selectedEvent.pax}</p>
      </div>
      <div className="ms-2">
        <p className="event-sheet text-decoration-underline">reservation</p>
        <textarea
          placeholder="Add details "
          className=" event-text col-8"
          onChange={(e) => {
            onDetailsChange(e)
          }}
          onKeyDown={(e) => {
            return allowTabsInTextField(e)
          }}
          readOnly={!edit}
          value={
            edit
              ? details
              : eventSheet
              ? eventSheet.details
              : !edit && detailsPrint
              ? detailsPrint
              : details
          }
        />
      </div>
      <div className="event-sheet">
        <p>
          Prepared by{' '}
          {eventSheet && eventSheet.User
            ? eventSheet.User.firstName + ' ' + eventSheet.User.lastName
            : user}
        </p>
        <p>
          {' '}
          {eventSheet && eventSheet.User ? eventSheet.User.Role.name : role}
        </p>
      </div>
      {printing ? (
        <p>Printed on: {new Date().toLocaleDateString('fr-FR')}</p>
      ) : null}
    </div>
  )
}

export default EventSheet
