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
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectItem } from 'src/redux/Select/selectionActions'

function ReceiveVouchers() {
  const dispatch = useDispatch()
  const [receiveVauchers, setReceiveVauchers] = useState([])
  useEffect(() => {
    const getVauchers = async () => {
      await instance
        .get('/receive/voucher/all')
        .then((res) => {
          console.log(res)
          setReceiveVauchers(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getVauchers()
  }, [])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h2>
              <strong> All Receive vaucher </strong>
            </h2>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col"> id </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Date </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Action </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {receiveVauchers && receiveVauchers.length !== 0 ? (
                  receiveVauchers.map((vaucher, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>{vaucher.id}</CTableDataCell>
                      <CTableDataCell>
                        {new Date(vaucher.date).toLocaleDateString()}
                      </CTableDataCell>
                      <CTableDataCell>
                        <Link
                          to="/booking/stock/received/view"
                          className="btn btn-warning "
                          onClick={() => dispatch(selectItem(vaucher))}
                        >
                          view
                        </Link>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                ) : (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={4}
                      className=" text-capitalize fw-bolder text-center"
                    >
                      {' '}
                      no receive vauchers in database
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ReceiveVouchers
