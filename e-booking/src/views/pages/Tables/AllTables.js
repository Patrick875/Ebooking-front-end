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

function AllTables() {
  const [items, setItems] = useState([])
  const disactivateTable = async (id) => {
    await instance.get(`/api/v1/tables/disactivate/${id}`).then(() => {
      toast.success('item deleted!!!!')
    })
  }
  const activateTable = async (id) => {
    await instance.get(`/api/v1/tables/activate/${id}`).then(() => {
      toast.success('item deleted!!!!')
    })
  }
  useEffect(() => {
    const getItems = async () => {
      await instance
        .get('/api/v1/tables/all')
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
          <strong> Tables </strong>
        </h2>
      </CCardHeader>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Number</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items && items.length !== 0
              ? items.map((item, i) => {
                  return (
                    <CTableRow key={item.id}>
                      <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                      <CTableDataCell>{`${item.name}`}</CTableDataCell>
                      <CTableDataCell className="d-flex ">
                        <Link
                          disabled={item.status === 'active' ? true : false}
                          className={` btn btn-sm btn-success`}
                          onClick={() => {
                            return activateTable(item.id)
                          }}
                        >
                          Activate
                        </Link>
                        <Link
                          disabled={item.status === 'disactive' ? true : false}
                          className={` btn btn-sm btn-danger`}
                          onClick={() => {
                            return disactivateTable(item.id)
                          }}
                        >
                          Disactivate
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

export default AllTables
