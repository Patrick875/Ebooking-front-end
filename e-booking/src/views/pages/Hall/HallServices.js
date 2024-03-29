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
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

function HallServices() {
  const dispatch = useDispatch()
  const [hallServices, setHallServices] = useState([])
  const role = useSelector((state) => state.auth.role)
  const deleteService = async (service) => {
    await instance
      .post(`/hall/services/delete`, { id: service })
      .then(() => {
        toast.success('Hall service delete successfully')
      })
      .catch(() => {
        console.log('error deleting service')
      })
  }
  useEffect(() => {
    const getHallServices = async () => {
      await instance
        .get('/hall/services/all')
        .then((res) => {
          setHallServices(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
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
                  <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                  {role && role === 'admin' ? (
                    <CTableHeaderCell scope="col"> Action </CTableHeaderCell>
                  ) : null}
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
                          <CTableDataCell>{hallService.name}</CTableDataCell>
                          <CTableDataCell>{hallService.price}</CTableDataCell>
                          {role && role === 'admin' ? (
                            <CTableDataCell className="d-flex gap-2">
                              <Link
                                to="/booking/halls/services/edit"
                                className="btn btn-warning"
                                onClick={() => {
                                  return dispatch(selectItem(hallService))
                                }}
                              >
                                edit
                              </Link>{' '}
                              <Link
                                onClick={() => {
                                  deleteService(hallService.id)
                                }}
                                className="btn btn-danger"
                              >
                                remove
                              </Link>{' '}
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

export default HallServices
