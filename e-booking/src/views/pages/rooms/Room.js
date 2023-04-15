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
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import { selectItem } from 'src/redux/Select/selectionActions'

const Room = () => {
  const dispatch = useDispatch()
  const [rooms, setRooms] = useState([])
  useEffect(() => {
    const getRooms = async () => {
      await instance
        .get('/room/all')
        .then((res) => {
          setRooms(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getRooms()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> Available rooms </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    {' '}
                    Name | N <sup>o</sup>{' '}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Action </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {rooms && rooms.length !== 0
                  ? rooms.map((room, i) => {
                      return (
                        <CTableRow key={room.id}>
                          <CTableHeaderCell scope="row">
                            {i + 1}
                          </CTableHeaderCell>
                          <CTableDataCell>
                            {' '}
                            {room.RoomClass.name}{' '}
                          </CTableDataCell>
                          <CTableDataCell>{`#${room.name}`}</CTableDataCell>
                          <CTableDataCell>
                            {' '}
                            <Link
                              to="/booking/reservations/add"
                              onClick={() => {
                                return dispatch(selectItem(room))
                              }}
                            >
                              Book now
                            </Link>{' '}
                          </CTableDataCell>
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

export default Room
