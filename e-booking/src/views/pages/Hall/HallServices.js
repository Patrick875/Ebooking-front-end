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
import { selectItem } from 'src/redux/Select/selectionActions'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

function HallServices() {
  const dispatch = useDispatch()
  const [hallServices, setHallServices] = useState([])
  useEffect(() => {
    const getHallServices = async () => {
      await instance
        .get('/hall/services/all')
        .then((res) => {
          setHallServices(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getHallServices()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> Available hall Services </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Action </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {hallServices && hallServices.length !== 0
                  ? hallServices.map((hallService, i) => {
                      return (
                        <CTableRow key={hallService.id}>
                          <CTableHeaderCell scope="row">
                            {i + 1}
                          </CTableHeaderCell>
                          <CTableDataCell>{`${hallService.name}`}</CTableDataCell>
                          <CTableDataCell>
                            <Link
                              to="/booking/halls/services/edit"
                              onClick={() => {
                                return dispatch(selectItem(hallService))
                              }}
                            >
                              edit
                            </Link>{' '}
                            <Link
                              to="/booking/halls/services/"
                              onClick={() => {
                                console.log('hall edit')
                                // return dispatch(selectRoom(hall))
                              }}
                            >
                              remove
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

export default HallServices
