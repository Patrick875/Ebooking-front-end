import {
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { FcInfo } from 'react-icons/fc'

function ServiceCategories() {
  const [items, setItems] = useState([])
  const deleteServiceCategory = async (serviceId) => {
    await instance
      .delete(`/services/category/delete/${serviceId}`)
      .then(() => {
        toast.success('service category deleted successfully')
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
  useEffect(() => {
    const getItems = async () => {
      await instance
        .get('/services/category/all')
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
      <CCardHeader>
        <h2>
          <strong> Service categories </strong>
        </h2>
      </CCardHeader>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items && items.length !== 0
              ? items.map((item, i) => {
                  return (
                    <CTableRow key={item.id}>
                      <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                      <CTableDataCell>{item.name}</CTableDataCell>
                      <CTableDataCell>
                        <Link
                          className="btn btn-danger"
                          onClick={() => {
                            if (!item.Service) {
                              deleteServiceCategory(item.id)
                            } else {
                              toast.custom(
                                <div className="p-4 bg-white rounded rounded-3 d-flex gap-2">
                                  <FcInfo size={32} />
                                  <p>
                                    Can not delete service category as it has
                                    services attached to it
                                  </p>
                                </div>,
                              )
                            }
                          }}
                        >
                          Delete
                        </Link>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              : null}
          </CTableBody>
        </CTable>
      </CCardBody>
    </div>
  )
}

export default ServiceCategories
