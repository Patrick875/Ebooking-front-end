import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import { getRoomStatus } from 'src/utils/functions'
function RoomReportTable(props) {
  const { rooms, roomClasses, setRooms } = props
  const role = useSelector((state) => state.auth.role)
  const [style, setStyle] = useState()
  const deleteRoom = async (id) => {
    await instance
      .delete(`/room/${id}`)
      .then(() => {
        toast.success('room deleted!!!!')
      })
      .catch((err) => {
        toast.error('error deleting room ')
      })
  }
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
                          <CTableRow
                            key={room.id}
                            onMouseEnter={(e) => {
                              setStyle({ display: 'block' })
                            }}
                            onMouseLeave={(e) => {
                              setStyle({ display: 'none' })
                            }}
                          >
                            <CTableHeaderCell className="d-flex  gap-2">
                              {`#${room.name}`}
                            </CTableHeaderCell>
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
                            <CTableDataCell className="d-flex gap-2">
                              {cool.status}

                              {role === 'admin' ? (
                                <div
                                  className="btn btn-danger btn-sm"
                                  style={style}
                                  onClick={() => {
                                    setRooms(
                                      rooms.filter((el) =>
                                        el !== room ? el : null,
                                      ),
                                    )
                                    deleteRoom(room.id)
                                  }}
                                >
                                  Delete room
                                </div>
                              ) : null}
                            </CTableDataCell>
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
