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
import Pagination from 'src/utils/Pagination'

const Room = () => {
  const dispatch = useDispatch()
  const [rooms, setRooms] = useState([])
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
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
              <strong> All rooms </strong>
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
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {rooms && rooms.length !== 0
                  ? rooms
                      .filter((el, i) => {
                        if (currentPage === 1) {
                          return i >= 0 && i < perpage ? el : null
                        } else {
                          return i >= (currentPage - 1) * perpage &&
                            i <= perpage * currentPage - 1
                            ? el
                            : null
                        }
                      })
                      .map((room, i) => {
                        return (
                          <CTableRow key={room.id}>
                            <CTableHeaderCell scope="row">
                              {(currentPage - 1) * perpage + 1 + i}
                            </CTableHeaderCell>
                            <CTableDataCell>
                              {' '}
                              {room.RoomClass.name}{' '}
                            </CTableDataCell>
                            <CTableDataCell>{`#${room.name}`}</CTableDataCell>
                          </CTableRow>
                        )
                      })
                  : null}
              </CTableBody>
            </CTable>

            {rooms.length !== 0 ? (
              <Pagination
                postsPerPage={perpage}
                totalPosts={rooms.length}
                paginate={paginate}
              />
            ) : null}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Room
