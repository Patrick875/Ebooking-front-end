import React, { useEffect, useState } from 'react'
import {
  CButton,
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
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import { selectItem } from 'src/redux/Select/selectionActions'
import {
  deselectRoom,
  selectRoom,
} from 'src/redux/reservation/reservationActions'

const RoomClasses = () => {
  const role = useSelector((state) => state.auth.role) || null
  const dispatch = useDispatch()
  const [roomClasses, setRoomClasses] = useState([])
  const [rooms, setRooms] = useState([])
  const deleteRoomClass = async (roomClassId) => {
    await instance
      .delete(`/roomclass/delete/${roomClassId}`)
      .then(() => {
        toast.success('Room Class deleted')
      })
      .catch((err) => {
        console.log(err.message)
      })
  }
  useEffect(() => {
    const getClasses = async () => {
      await instance
        .get('/roomclass/all')
        .then((res) => {
          setRoomClasses(res.data.data)
          console.log('res', res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    const getRooms = async () => {
      await instance
        .get('/room/all')
        .then((res) => {
          setRooms(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getRooms()
    getClasses()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> All room classes </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                  {role && role === 'admin' ? (
                    <CTableHeaderCell scope="col"> Action </CTableHeaderCell>
                  ) : null}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {roomClasses && roomClasses.length !== 0
                  ? roomClasses.map((roomClass, i) => {
                      return (
                        <CTableRow key={roomClass.id}>
                          <CTableHeaderCell scope="row">
                            {i + 1}
                          </CTableHeaderCell>
                          <CTableDataCell>
                            {' '}
                            <div>
                              <p className="fw-bold">{roomClass.name}</p>
                              <p>
                                {rooms
                                  .filter(
                                    (el) => el.RoomClass.id == roomClass.id,
                                  )
                                  .map((room, i, arr) => {
                                    if (i === arr.length - 1) {
                                      return (
                                        <span key={room.id}>{room.name}</span>
                                      )
                                    }
                                    return (
                                      <span key={room.id}>{room.name} / </span>
                                    )
                                  })}
                              </p>
                            </div>{' '}
                          </CTableDataCell>
                          <CTableDataCell>{`${roomClass.price} USD`}</CTableDataCell>
                          {role && role === 'admin' ? (
                            <CTableDataCell>
                              {' '}
                              <Link
                                type="link"
                                to="/booking/rooms/class/edit"
                                className=" btn btn-warning text-text-decoration-none"
                                disabled={
                                  role && role !== 'admin' ? true : false
                                }
                                onClick={() => {
                                  return dispatch(selectItem(roomClass))
                                }}
                              >
                                update
                              </Link>{' '}
                              <CButton
                                className="text-capitalize btn-danger"
                                to="/booking/reservations/add"
                                disabled={
                                  role && role !== 'admin' ? true : false
                                }
                                onClick={() => deleteRoomClass(roomClass.id)}
                              >
                                delete
                              </CButton>{' '}
                            </CTableDataCell>
                          ) : null}
                        </CTableRow>
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

export default RoomClasses
