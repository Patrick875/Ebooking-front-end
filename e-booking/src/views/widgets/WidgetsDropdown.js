import React, { useEffect, useState } from 'react'
import { CRow, CWidgetStatsF } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilHome, cilHouse } from '@coreui/icons'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BsCalendarEvent } from 'react-icons/bs'

const WidgetsDropdown = () => {
  const role = useSelector((state) => state.auth.user.Role.name)
  const navigate = useNavigate()
  const [rooms, setRooms] = useState([])
  const [halls, setHalls] = useState([])
  const [users, setUsers] = useState([])
  let [customers, setCustomers] = useState([])
  const managerRoles = [
    'admin',
    'general accountant',
    'manager',
    'general manager',
  ]

  useEffect(() => {
    const getCustomers = async () => {
      await instance
        .get('/customers/all')
        .then((res) => {
          if (res && res.data && res.data.data) {
            setCustomers(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    const getRooms = async () => {
      await instance
        .get('/room/all')
        .then((res) => {
          if (res && res.data && res.data.data) {
            setRooms(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }

    const getHalls = async () => {
      await instance
        .get('/halls/all')
        .then((res) => {
          if (res && res.data && res.data.data) {
            setHalls(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    const getUsers = async () => {
      await instance
        .get(`/users/all`)
        .then((res) => {
          if (res && res.data && res.data.data) {
            setUsers(res.data.users)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }

    getUsers()
    getHalls()
    getRooms()
    getCustomers()
  }, [])

  return (
    <CRow className="widgets ">
      <div
        className="col-md-6 col-sm-12 col"
        xs={12}
        sm={6}
        lg={3}
        onClick={() => {
          navigate('/booking/events')
        }}
      >
        <CWidgetStatsF
          className="mb-3 py-2"
          icon={<BsCalendarEvent width={64} />}
          title="Events"
          color="danger"
        />
      </div>
      <div
        className="col-md-6 col-sm-12 col"
        onClick={() => {
          navigate('/booking/rooms/available')
        }}
      >
        <CWidgetStatsF
          className="mb-3"
          icon={<CIcon width={48} icon={cilHouse} size="xl" />}
          title="Rooms"
          value={rooms.length}
          color="primary"
        />
      </div>
      <div
        className="col-md-6 col-sm-12 col"
        onClick={() => {
          navigate('/booking/halls')
        }}
      >
        <CWidgetStatsF
          className="mb-3 "
          icon={<CIcon width={48} icon={cilHome} size="xl" />}
          title="Halls"
          value={halls.length}
          color="warning"
        />
      </div>
      <div
        className="col-md-6 col-sm-12 col"
        xs={12}
        sm={6}
        lg={3}
        onClick={() => {
          navigate('/customers')
        }}
      >
        <CWidgetStatsF
          className="mb-3"
          icon={<CIcon width={48} icon={cilUser} size="xl" />}
          title="Customers"
          value={customers.length}
          color="info"
        />
      </div>
      {!managerRoles.includes(role.toLowerCase()) ? (
        <div
          className="col-md-6 col-sm-12 col"
          xs={12}
          sm={6}
          lg={3}
          onClick={() => {
            navigate('/booking/users')
          }}
        >
          <CWidgetStatsF
            className="mb-3"
            icon={<CIcon width={48} icon={cilUser} size="xl" />}
            title="System User"
            value={users.length}
            color="danger"
          />
        </div>
      ) : null}
    </CRow>
  )
}

export default WidgetsDropdown
