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
    await instance.get(`/tables/disactivate/${id}`).then(() => {
      toast.success('item deleted!!!!')
    })
  }
  const activateTable = async (id) => {
    await instance.get(`/tables/activate/${id}`).then(() => {
      toast.success('item deleted!!!!')
    })
  }
  useEffect(() => {
    const getItems = async () => {
      await instance
        .get('/tables/all')
        .then((res) => {
          if (res && res.data && res.data.data) {
            setItems(res.data.data)
          }
          console.log('res', res)
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
                          className={` btn btn-sm btn-success ${
                            item.status === 'ACTIVE' ? 'd-none' : ''
                          }`}
                          onClick={() => {
                            return activateTable(item.id)
                          }}
                        >
                          Activate
                        </Link>
                        <Link
                          disabled={item.status === 'DISACTIVE' ? true : false}
                          className={` btn btn-sm btn-danger ${
                            item.status === 'DISACTIVE' ? 'd-none' : ''
                          }`}
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
