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
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import Pagination from 'src/utils/Pagination'
import { useSelector } from 'react-redux'

const Services = () => {
  const [services, setServices] = useState([])
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const user = useSelector((state) => state.auth.role)
  const deleteService = async (id) => {
    await instance
      .delete(`/services/delete/${id}`)
      .then(() => {
        toast.success('service deleted successfuly')
      })
      .catch((err) => {
        console.log(err)
        toast.error('error deleting service')
      })
  }
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  useEffect(() => {
    const services = async () => {
      await instance
        .get('/services/all')
        .then((res) => {
          setServices(res.data.data)
          console.log('all services', res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }

    services()
  }, [])
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> All Services </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    {' '}
                    Service title{' '}
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col">
                    {' '}
                    Service Price{' '}
                  </CTableHeaderCell>
                  {user !== 'admin' ? null : (
                    <CTableHeaderCell scope="col"> Option </CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {services && services.length !== 0
                  ? services
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
                      .map((service, i) => (
                        <CTableRow>
                          <CTableHeaderCell scope="row">
                            {(currentPage - 1) * perpage + 1 + i}
                          </CTableHeaderCell>
                          <CTableDataCell> {service.name} </CTableDataCell>
                          <CTableDataCell> {service.price} </CTableDataCell>
                          {user !== 'admin' ? null : (
                            <CTableDataCell className="d-flex gap-2">
                              <Link to="" className="btn btn-sm btn-warning">
                                Edit
                              </Link>
                              <Link
                                onClick={() => {
                                  return deleteService(service.id)
                                }}
                                className="btn btn-sm btn-danger"
                              >
                                Delete
                              </Link>
                            </CTableDataCell>
                          )}
                        </CTableRow>
                      ))
                  : null}
              </CTableBody>
            </CTable>
            <Pagination
              postsPerPage={10}
              totalPosts={services.length}
              paginate={paginate}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Services
