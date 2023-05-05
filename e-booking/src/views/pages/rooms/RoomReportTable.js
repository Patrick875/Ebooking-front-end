import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'
import { getRoomStatus } from 'src/utils/functions'
function RoomReportTable(props) {
  const { rooms, roomClasses } = props
  return (
    <CTable bordered>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">ROOM #</CTableHeaderCell>
          <CTableHeaderCell scope="col">Guest Name</CTableHeaderCell>
          <CTableHeaderCell scope="col">Date in</CTableHeaderCell>
          <CTableHeaderCell scope="col">Date out</CTableHeaderCell>
          <CTableHeaderCell scope="col">Room rate</CTableHeaderCell>
          <CTableHeaderCell scope="col">Company</CTableHeaderCell>
          <CTableHeaderCell scope="col">Status</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {rooms && rooms.length !== 0 && roomClasses && roomClasses.length !== 0
          ? roomClasses
              .sort((a, b) => a.price - b.price)
              .map((roomClass, i, arr) => {
                return (
                  <React.Fragment>
                    <CTableRow>
                      <CTableDataCell
                        colSpan={8}
                        className="text-uppercase fw-bold"
                      >
                        {roomClass.name}
                      </CTableDataCell>
                    </CTableRow>
                    {rooms
                      .filter((room) => room.RoomClass.id === roomClass.id)
                      .map((room) => {
                        const cool = getRoomStatus(room)
                        return (
                          <CTableRow key={room.id}>
                            <CTableHeaderCell>{`#${room.name}`}</CTableHeaderCell>
                            <CTableDataCell></CTableDataCell>
                            <CTableDataCell>
                              {cool.status === 'OCCUPIED'
                                ? new Date(cool.checkIn).toLocaleDateString()
                                : ''}
                            </CTableDataCell>
                            <CTableDataCell>
                              {cool.status === 'OCCUPIED'
                                ? new Date(cool.checkOut).toLocaleDateString()
                                : ''}
                            </CTableDataCell>
                            <CTableDataCell>{`${roomClass.price} USD`}</CTableDataCell>
                            <CTableDataCell></CTableDataCell>
                            <CTableDataCell>{cool.status}</CTableDataCell>
                          </CTableRow>
                        )
                      })}
                  </React.Fragment>
                )
              })
          : null}
      </CTableBody>
    </CTable>
  )
}

export default RoomReportTable
