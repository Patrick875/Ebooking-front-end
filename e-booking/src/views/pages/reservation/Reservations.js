import React, { useState, useEffect } from 'react'
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
  CBadge,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { selectItem } from 'src/redux/Select/selectionActions'
import { toast } from 'react-hot-toast'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import AddPaymentModal from './AddPaymentModal'
import Pagination from 'src/utils/Pagination'

const Reservation = () => {
  const dispatch = useDispatch()
  const [clicked, setClicked] = useState({})
  const [reservations, setReservations] = useState([])
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const changeReservationStatus = async (data, action) => {
    await instance
      .put('/reservation/update', data)
      .then((res) => {
        console.log(res.data)
        toast.success(`Reservation ${action} success`)
      })
      .catch((err) => {
        toast.error(`Reservation ${action} failed`)
      })
  }
  useEffect(() => {
    const getReservations = async () => {
      await instance
        .get('/reservation/all')
        .then((res) => {
          console.log(res.data.data)
          setReservations(res.data.data.items)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getReservations()
  }, [])
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> All Reservations </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Names </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Phone </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Room/Hall </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> User </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Check in </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Check out </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Status </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Options </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {reservations && reservations.length !== 0
                  ? reservations.map((reserv, i) => (
                      <CTableRow key={reserv.id}>
                        <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                        <CTableDataCell>
                          {' '}
                          {reserv.Customer.names}{' '}
                          {Number(reserv.amount['RWF']) >
                          Number(reserv.payment['RWF']) ? (
                            <CBadge
                              type="button"
                              color="danger"
                              onClick={() => {
                                console.log(open)
                                setClicked({ id: reserv.id })
                                return setOpen(true)
                              }}
                            >
                              {' '}
                              Debt
                            </CBadge>
                          ) : null}
                        </CTableDataCell>
                        <CTableDataCell>
                          {' '}
                          {reserv.Customer.phone}{' '}
                        </CTableDataCell>
                        <CTableDataCell>
                          {reserv.details
                            ? Object.keys(reserv.details).map((e) => (
                                <p>
                                  {' '}
                                  {e} rooms: {reserv.details[e].people}{' '}
                                </p>
                              ))
                            : reserv.Room
                            ? reserv.Room.name
                            : reserv.Hall.name}
                        </CTableDataCell>
                        <CTableDataCell>
                          {' '}
                          {reserv.User.firstName + ' ' + reserv.User.lastName}
                        </CTableDataCell>
                        <CTableDataCell>
                          {' '}
                          {new Date(reserv.checkIn).toLocaleString()}
                        </CTableDataCell>
                        <CTableDataCell>
                          {' '}
                          {new Date(reserv.checkOut).toLocaleString()}{' '}
                        </CTableDataCell>
                        <CTableDataCell>
                          {reserv.status ? reserv.status : 'in progress'}{' '}
                        </CTableDataCell>
                        <CTableDataCell>
                          <Link
                            to="/booking/reservations/info"
                            className="badge badge-primary text-primary text-decoration-none"
                            onClick={() => dispatch(selectItem(reserv))}
                          >
                            {' '}
                            View{' '}
                          </Link>
                          <Link
                            className="badge badge-warning text-primary text-decoration-none"
                            onClick={() =>
                              changeReservationStatus(
                                {
                                  id: reserv.id,
                                  status: 'confirmed',
                                },
                                'confirm',
                              )
                            }
                          >
                            {' '}
                            Confirm{' '}
                          </Link>
                          <Link
                            className="badge badge-danger text-primary text-decoration-none"
                            onClick={() =>
                              changeReservationStatus(
                                {
                                  id: reserv.id,
                                  status: 'canceled',
                                },
                                'cancel',
                              )
                            }
                          >
                            {' '}
                            Cancel{' '}
                          </Link>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  : null}
                <AddPaymentModal
                  open={open}
                  reservation={clicked}
                  setOpen={setOpen}
                />
              </CTableBody>
            </CTable>
          </CCardBody>
          <Pagination postsPerPage={10} totalPosts={20} paginate={paginate} />
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Reservation
