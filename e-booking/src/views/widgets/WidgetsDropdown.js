import React, { useEffect, useState } from 'react'
import { CRow, CCol, CWidgetStatsF } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilHome, cilHouse } from '@coreui/icons'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

const WidgetsDropdown = () => {
  const [rooms, setRooms] = useState([])
  const [halls, setHalls] = useState([])
  const [users, setUsers] = useState([])
  const [reservations, setReservations] = useState([])
  let [customers, setCustomers] = useState([])
  useEffect(() => {
    const getCustomers = async () => {
      await instance
        .get('/customers/all')
        .then((res) => {
          setCustomers(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
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
    const getReservations = async () => {
      await instance
        .get('/reservation/all')
        .then((res) => {
          setReservations(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }

    const getUsers = async () => {
      await instance
        .get(`/users/all`)
        .then((res) => {
          setUsers(res.data.users)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }

    getUsers()
    getReservations()
    getHalls()
    getRooms()
    getCustomers()
  }, [])

  return (
    <CRow>
      <CCol xs={12} sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-3"
          icon={<CIcon width={24} icon={cilHouse} size="xl" />}
          title="Rooms"
          value={rooms.length}
          color="primary"
        />
      </CCol>
      <CCol xs={12} sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-3"
          icon={<CIcon width={24} icon={cilHome} size="xl" />}
          title="Halls"
          value={halls.length}
          color="warning"
        />
      </CCol>
      <CCol xs={12} sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-3"
          icon={<CIcon width={24} icon={cilUser} size="xl" />}
          title="Customers"
          value={customers.length}
          color="info"
        />
      </CCol>
      <CCol xs={12} sm={6} lg={3}>
        <CWidgetStatsF
          className="mb-3"
          icon={<CIcon width={24} icon={cilUser} size="xl" />}
          title="System User"
          value={users.length}
          color="danger"
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
