import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import { getRoomStatus } from 'src/utils/functions'

const Room = () => {
  const [rooms, setRooms] = useState([])
  const [roomClasses, setRoomClasses] = useState([])

  useEffect(() => {
    const getRooms = async () => {
      await instance
        .get('/room/all')
        .then((res) => {
          setRooms(res.data.data)
          console.log('rooms', res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    const getRoomClasses = async () => {
      await instance
        .get('/roomclass/all')
        .then((res) => {
          setRoomClasses(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getRooms()
    getRoomClasses()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4>
              <strong className="text-uppercase">
                {' '}
                Room status report on {new Date().toLocaleDateString()}{' '}
              </strong>
            </h4>
          </CCardHeader>
          <CCardBody>
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
                {rooms &&
                rooms.length !== 0 &&
                roomClasses &&
                roomClasses.length !== 0
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
                              .filter(
                                (room) => room.RoomClass.id === roomClass.id,
                              )
                              .map((room) => {
                                const cool = getRoomStatus(room)
                                return (
                                  <CTableRow key={room.id}>
                                    <CTableHeaderCell>{`#${room.name}`}</CTableHeaderCell>
                                    <CTableDataCell></CTableDataCell>
                                    <CTableDataCell>
                                      {cool.status === 'OCCUPIED'
                                        ? new Date(
                                            cool.checkIn,
                                          ).toLocaleDateString()
                                        : ''}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      {cool.status === 'OCCUPIED'
                                        ? new Date(
                                            cool.checkOut,
                                          ).toLocaleDateString()
                                        : ''}
                                    </CTableDataCell>
                                    <CTableDataCell>{`${roomClass.price} USD`}</CTableDataCell>
                                    <CTableDataCell></CTableDataCell>
                                    <CTableDataCell>
                                      {cool.status}
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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Room
