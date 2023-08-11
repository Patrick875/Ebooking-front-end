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
import { getRoomStatus, isRoomOccupied } from 'src/utils/functions'
function RoomReportTable(props) {
  const { rooms, roomClasses, setRooms } = props
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const role = useSelector((state) => state.auth.role)
  const [style, setStyle] = useState({ display: 'none' })

  const getReservationStatus = (room, isOccupied) => {
    if (Object.keys(isOccupied).length !== 0) {
      const reservation = isOccupied.reservation

      if (
        reservation.status === 'confirmed' &&
        reservation.roomStatus !== 'checked-out'
      ) {
        return 'OCCUPIED'
      } else if (reservation.status !== 'confirmed') {
        return 'Reserved'
      } else if (
        reservation.roomStatus === 'checked-out' &&
        room.status !== 'out of order' &&
        reservation.DatesIns.sort((a, b) => b.id - a.id)[0].datesIn.some(
          (el) =>
            new Date(el).toLocaleDateString('fr-FR') ===
            new Date().toLocaleDateString('fr-FR'),
        )
      ) {
        return 'Checked out'
      }
    }

    return room.status === 'active' ? 'Available' : room.status
  }

  const getBackgroundColor = (room, isOccupied) => {
    if (room.status === 'out of order') {
      return 'red'
    }

    if (
      Object.keys(isOccupied).length === 0 ||
      !isOccupied.reservation.DatesIns.sort((a, b) => b.id - a.id)[0]
        .datesIn.map((el) => new Date(el).toLocaleDateString('fr-FR'))
        .includes(new Date().toLocaleDateString('fr-FR'))
    ) {
      return 'white'
    }

    if (
      isOccupied.reservation &&
      isOccupied.reservation.status !== 'confirmed'
    ) {
      return '#9400D3' // Dark violet
    }

    if (
      isOccupied.reservation &&
      isOccupied.reservation.roomStatus === 'checked-out'
    ) {
      return 'orange'
    }

    return 'green'
  }

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
                        const reservationStatus = getReservationStatus(
                          room,
                          isOccupied,
                        )

                        return (
                          <CTableRow
                            key={room.id}
                            style={{
                              backgroundColor: getBackgroundColor(
                                room,
                                isOccupied,
                              ),
                            }}
                          >
                            <CTableHeaderCell
                              className="d-flex  gap-2"
                              onClick={() => {
                                if (
                                  isOccupied &&
                                  Object.keys(isOccupied).length !== 0 &&
                                  isOccupied.reservation.DatesIns.sort(
                                    (a, b) => b.id - a.id,
                                  )[0]
                                    .datesIn.map((el) =>
                                      new Date(el).toLocaleDateString('fr-FR'),
                                    )
                                    .includes(
                                      new Date().toLocaleDateString('fr-FR'),
                                    )
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
                              {isOccupied &&
                              isOccupied.reservation &&
                              isOccupied.reservation.DatesIns.sort(
                                (a, b) => b.id - a.id,
                              )[0]
                                .datesIn.map((el) =>
                                  new Date(el).toLocaleDateString('fr-FR'),
                                )
                                .includes(
                                  new Date().toLocaleDateString('fr-FR'),
                                )
                                ? isOccupied.reservation &&
                                  isOccupied.reservation.affiliation
                                  ? isOccupied.reservation.affiliation.names +
                                    ' /' +
                                    isOccupied.reservation.Customer.names
                                  : isOccupied.reservation.Customer.names
                                : ''}
                            </CTableDataCell>
                            <CTableDataCell>
                              {isOccupied &&
                              isOccupied.reservation &&
                              isOccupied.reservation.DatesIns.sort(
                                (a, b) => b.id - a.id,
                              )[0]
                                .datesIn.map((el) =>
                                  new Date(el).toLocaleDateString('fr-FR'),
                                )
                                .includes(
                                  new Date().toLocaleDateString('fr-FR'),
                                )
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
                              {isOccupied &&
                              isOccupied.reservation &&
                              isOccupied.reservation.DatesIns.sort(
                                (a, b) => b.id - a.id,
                              )[0]
                                .datesIn.map((el) =>
                                  new Date(el).toLocaleDateString('fr-FR'),
                                )
                                .includes(
                                  new Date().toLocaleDateString('fr-FR'),
                                )
                                ? new Date(
                                    isOccupied.reservation.DatesIns.sort(
                                      (a, b) => b.id - a.id,
                                    )[0].datesIn.sort(
                                      (a, b) => new Date(b) - new Date(a),
                                    )[0],
                                  ).toLocaleDateString('fr-FR')
                                : ''}
                            </CTableDataCell>
                            <CTableDataCell>{`${roomClass.price} USD`}</CTableDataCell>
                            <CTableDataCell></CTableDataCell>
                            <CTableDataCell className="d-flex gap-2">
                              {reservationStatus}
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

// onClick={() => {
//                                   setRooms(
//                                     rooms.filter((el) =>
//                                       el !== room ? el : null,
//                                     ),
//                                   )
//                                   deleteRoom(room.id)
//                                 }}
