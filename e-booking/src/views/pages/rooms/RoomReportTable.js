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
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectItem } from 'src/redux/Select/selectionActions'
import { selectRoom } from 'src/redux/reservation/reservationActions'
import { isRoomOccupied } from 'src/utils/functions'
function RoomReportTable(props) {
  const { rooms, roomClasses, setRooms } = props
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const role = useSelector((state) => state.auth.role)
  const [style, setStyle] = useState({ display: 'none' })
  const deleteRoom = async (id) => {
    await instance
      .delete(`/room/${id}`)
      .then(() => {
        toast.success('room deleted!!!!')
      })
      .catch((err) => {
        console.log('error deleting room ')
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
                        const isOccupied = isRoomOccupied(room)

                        return (
                          <CTableRow
                            key={room.id}
                            style={{
                              backgroundColor:
                                Object.keys(isOccupied).length !== 0 &&
                                isOccupied.reservation.roomStatus !==
                                  'checked-out'
                                  ? 'green'
                                  : Object.keys(isOccupied).length !== 0 &&
                                    isOccupied.reservation.roomStatus ===
                                      'checked-out'
                                  ? 'orange'
                                  : 'white',
                            }}
                          >
                            <CTableHeaderCell
                              className="d-flex  gap-2"
                              onClick={() => {
                                if (
                                  isOccupied &&
                                  Object.keys(isOccupied).length !== 0
                                ) {
                                  dispatch(
                                    selectItem({
                                      ...isOccupied.reservation,
                                      Room: room,
                                    }),
                                  )
                                  navigate('/booking/reservations/info')
                                } else {
                                  dispatch(selectRoom(room))
                                  navigate('/booking/room/checkin')
                                }
                              }}
                            >
                              {`#${room.name}`}
                            </CTableHeaderCell>
                            <CTableDataCell>
                              {isOccupied && isOccupied.reservation
                                ? isOccupied.reservation &&
                                  isOccupied.reservation.affiliation
                                  ? isOccupied.reservation.affiliation.names +
                                    ' /' +
                                    isOccupied.reservation.Customer.names
                                  : isOccupied.reservation.Customer.names
                                : ''}
                            </CTableDataCell>
                            <CTableDataCell>
                              {isOccupied && isOccupied.reservation
                                ? new Date(
                                    isOccupied.reservation.DatesIns[
                                      isOccupied.reservation.DatesIns.length - 1
                                    ].datesIn.sort(
                                      (a, b) => new Date(a) - new Date(b),
                                    )[0],
                                  ).toLocaleDateString('fr-FR')
                                : ''}
                            </CTableDataCell>
                            <CTableDataCell>
                              {isOccupied && isOccupied.reservation
                                ? new Date(
                                    isOccupied.reservation.DatesIns[
                                      isOccupied.reservation.DatesIns.length - 1
                                    ].datesIn.sort(
                                      (a, b) => new Date(a) - new Date(b),
                                    )[
                                      isOccupied.reservation.DatesIns[
                                        isOccupied.reservation.DatesIns.length -
                                          1
                                      ].datesIn.length - 1
                                    ],
                                  ).toLocaleDateString('fr-FR')
                                : ''}
                            </CTableDataCell>
                            <CTableDataCell>{`${roomClass.price} USD`}</CTableDataCell>
                            <CTableDataCell></CTableDataCell>
                            <CTableDataCell
                              className="d-flex gap-2"
                              onMouseEnter={(e) => {
                                setStyle({ display: 'block' })
                              }}
                              onMouseLeave={(e) => {
                                setStyle({ display: 'none' })
                              }}
                            >
                              {Object.keys(isOccupied).length !== 0 &&
                              isOccupied.reservation.roomStatus !==
                                'checked-out'
                                ? 'OCCUPIED'
                                : Object.keys(isOccupied).length !== 0 &&
                                  isOccupied.reservation.roomStatus ===
                                    'checked-out'
                                ? 'Checkout today'
                                : 'VACANT'}

                              {role === 'admin' ? (
                                <div style={style}>
                                  <div
                                    className="btn btn-danger btn-sm"
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
