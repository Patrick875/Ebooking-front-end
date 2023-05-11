import { React, useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Link } from 'react-router-dom'
import { deleteUser } from 'src/redux/User/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { selectItem } from 'src/redux/Select/selectionActions'
import { useForm } from 'react-hook-form'
import { instance } from 'src/API/AxiosInstance'
import { USER_ACTIONS } from 'src/redux/User/userActionTypes'

const ConfirmDeleteUserModel = (props) => {
  const { visible, setVisible, user, users } = props
  const dispatch = useDispatch()
  return (
    <CModal onClose={() => setVisible(false)} visible={visible}>
      <CModalHeader>Confirm user delete</CModalHeader>
      <CModalBody>
        <p>Are you sure you want to delete this user</p>
      </CModalBody>
      <CModalFooter>
        <CButton className="btn-secondary" onClick={() => setVisible(false)}>
          Cancel
        </CButton>
        <CButton
          className="btn-danger"
          onClick={() => {
            return dispatch(deleteUser(user, users))
          }}
        >
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

const Users = () => {
  const { register, watch } = useForm()
  const query = watch('query') || ''
  let [users, setUsers] = useState([])

  let role = useSelector((state) => state.auth.user.Role.name)
  const [visible, setVisible] = useState(false)
  users = users ? users : []
  const searchUsers = (users, query) => {
    if (query && query !== '') {
      return users.filter((user) =>
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase())
          ? user
          : null,
      )
    } else {
      return users
    }
  }

  users = searchUsers(users, query)
  const dispatch = useDispatch()
  useEffect(() => {
    const getUsers = async () => {
      await instance.get(`/users/all`).then((res) => {
        setUsers(res.data.users)
      })
    }
    getUsers()
  }, [])

  console.log('users', users, query)
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <div className="d-flex justify-content-between">
              <h2>
                <strong> All Users </strong>
              </h2>
              <div className="col-md-4">
                <form>
                  <CFormLabel className="text-center">Search</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="userName"
                    id="userName"
                    size="md"
                    placeholder="by name ..."
                    {...register('query')}
                  />
                </form>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Names </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Phone </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Email </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Roles </CTableHeaderCell>
                  {role === 'admin' ? (
                    <CTableHeaderCell scope="col"> Option </CTableHeaderCell>
                  ) : null}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {users && users.length !== 0 ? (
                  users.map((user, i) => (
                    <CTableRow
                      key={user._id}
                      className={`${
                        user.status === 'disactive' ? 'bg-dark' : ''
                      }`}
                    >
                      <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                      <CTableDataCell>
                        {' '}
                        {user.firstName + ' ' + user.lastName}{' '}
                      </CTableDataCell>
                      <CTableDataCell>{user.phone} </CTableDataCell>
                      <CTableDataCell> {user.email} </CTableDataCell>
                      <CTableDataCell> {user.Role.name}</CTableDataCell>
                      {role === 'admin' ? (
                        <CTableDataCell>
                          <Link
                            to="/booking/user/edit"
                            className={`${
                              role === 'controller' ? 'disabled' : ''
                            } btn btn-sm btn-warning`}
                            onClick={() => {
                              console.log('this is user', user)
                              return dispatch(selectItem(user))
                            }}
                          >
                            {' '}
                            Edit{' '}
                          </Link>
                          <button
                            className={`${
                              role === 'controller' ? 'disabled' : ''
                            } btn btn-sm btn-danger`}
                            onClick={() => {
                              return setVisible(!visible)
                            }}
                          >
                            Delete
                          </button>
                          <ConfirmDeleteUserModel
                            visible={visible}
                            setVisible={setVisible}
                            user={user}
                            users={users}
                          />
                        </CTableDataCell>
                      ) : null}
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

export default Users
