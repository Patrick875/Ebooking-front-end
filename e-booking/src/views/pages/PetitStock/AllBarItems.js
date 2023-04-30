import {
  CButton,
  CCardBody,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { BiCartAdd, BiCartDownload } from 'react-icons/bi'
import { BsFiles } from 'react-icons/bs'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'
import { Link } from 'react-router-dom'
function AllBarItems() {
  const [items, setItems] = useState([])
  useEffect(() => {
    const getItems = async () => {
      await instance
        .get('/petitstock/balance')
        .then((res) => {
          setItems(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getItems()
  }, [])

  return (
    <div>
      <CCardBody>
        <p className="text-center fs-3">Kitchen stock</p>
        <CRow>
          <div className="d-flex justify-content-between my-3">
            <Link md={4} className="btn btn-primary" to="/booking/bar/request">
              <BiCartDownload className="fs-5" /> Request item from stock
            </Link>
            <Link
              md={4}
              className="btn btn-primary"
              to="/booking/bar/request/all"
            >
              <BsFiles className="fs-5" /> All requests
            </Link>
          </div>
          <p className="text-center fs-4">
            <strong> Current stock </strong>
          </p>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {items && items.length !== 0
                ? items.map((item, i) => {
                    return (
                      <CTableRow key={item.id}>
                        <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                        <CTableDataCell>{`${item.StockItem.name}`}</CTableDataCell>
                        <CTableDataCell>{`${item.quantinty}`}</CTableDataCell>
                      </CTableRow>
                    )
                  })
                : null}
            </CTableBody>
          </CTable>
        </CRow>
      </CCardBody>
    </div>
  )
}

export default AllBarItems
