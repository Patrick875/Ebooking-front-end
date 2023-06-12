import { React, useEffect, useState } from 'react'
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
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
const UserRoles = () => {
  let loggedInUser = useSelector((state) => state.auth.user.Role.name)
  const [roles, setRoles] = useState([])
  const [change, setChange] = useState(false)

  const dispatch = useDispatch()
  const deleteUserRole = async (id) => {
    await instance
      .delete(`/roles/delete/${id}`)
      .then(() => {
        toast.success('User role deleted')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }
  useEffect(() => {
    const getAllRoles = async () => {
      await instance
        .get('/roles/all')
        .then((res) => {
          setRoles(res.data.roles)
          toast.success('all roles available')
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getAllRoles()
  }, [change])
  useEffect(() => {}, [roles])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> All user roles </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Name </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Access </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Permissions </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Action </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {roles && roles.length !== 0 ? (
                  roles.map((role, i) => (
                    <CTableRow key={role._id}>
                      <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                      <CTableDataCell> {role.name} </CTableDataCell>
                      <CTableDataCell>
                        {' '}
                        {role.access && Object.keys(role.access).length !== 0
                          ? Object.keys(role.access).map((acces) => (
                              <div className="">
                                <p className="fw-bolder text-capitalize py-1">
                                  {acces}
                                </p>

                                <div className="ms-3">
                                  {role.access[acces].map((perm) => (
                                    <p className="text-capitalize">{perm}</p>
                                  ))}
                                </div>
                              </div>
                            ))
                          : role.name === 'admin'
                          ? 'all'
                          : ''}{' '}
                      </CTableDataCell>
                      <CTableDataCell>all</CTableDataCell>
                      <CTableDataCell className="d-flex gap-2">
                        <Link
                          to="/booking/user/roles/edit"
                          className={`${
                            loggedInUser === 'controller' ? 'disabled' : ''
                          } btn btn-sm btn-warning`}
                          onClick={() => {
                            console.log('this is role', role)
                            return dispatch(selectItem(role))
                          }}
                        >
                          {' '}
                          Edit{' '}
                        </Link>
                        <button
                          className={`${
                            loggedInUser === 'controller' ? 'disabled' : ''
                          } btn btn-sm btn-danger`}
                          onClick={() => {
                            setChange(!change)
                            return deleteUserRole(role.id)
                          }}
                        >
                          Delete
                        </button>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow></CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UserRoles
