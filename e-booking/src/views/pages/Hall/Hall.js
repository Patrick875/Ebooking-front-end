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
import { useDispatch, useSelector } from 'react-redux'
import { selectItem } from 'src/redux/Select/selectionActions'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

function Hall() {
  const dispatch = useDispatch()
  const role = useSelector((state) => state.auth.role)
  const [halls, setHalls] = useState([])
  useEffect(() => {
    const getHalls = async () => {
      await instance
        .get('/halls/all')
        .then((res) => {
          setHalls(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }

    getHalls()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> All halls </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                  {role && role === 'admin' ? (
                    <CTableHeaderCell scope="col"> Action </CTableHeaderCell>
                  ) : null}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {halls && halls.length !== 0
                  ? halls.map((hall, i) => {
                      return (
                        <CTableRow key={hall.id}>
                          <CTableHeaderCell scope="row">
                            {i + 1}
                          </CTableHeaderCell>
                          <CTableDataCell>{`${hall.name}`}</CTableDataCell>
                          <CTableDataCell>{`${hall.price} RWF`}</CTableDataCell>

                          <CTableDataCell>
                            {' '}
                            <Link
                              to="/booking/halls/info"
                              className="text-decoration-none btn btn-primary "
                              disabled={role && role !== 'admin' ? true : false}
                              onClick={() => {
                                return dispatch(selectItem(hall))
                              }}
                            >
                              view
                            </Link>{' '}
                            {role && role === 'admin' ? (
                              <Link
                                to="/booking/halls/edit"
                                disabled={
                                  role && role !== 'admin' ? true : false
                                }
                                className="text-decoration-none btn btn-warning"
                                onClick={() => {
                                  return dispatch(selectItem(hall))
                                }}
                              >
                                edit
                              </Link>
                            ) : null}
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

export default Hall
