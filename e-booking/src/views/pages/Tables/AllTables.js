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
  //   const deleteStockItem = async (id) => {
  //     await instance.delete(`/stock/item/delete/${id}`).then(() => {
  //       toast.success('item deleted!!!!')
  //     })
  //   }
  //   useEffect(() => {
  //     const getItems = async () => {
  //       await instance
  //         .get('/stock/item/all')
  //         .then((res) => {
  //           setItems(res.data.data)
  //         })
  //         .catch((err) => {
  //           toast.error(err.message)
  //         })
  //     }
  //     getItems()
  //   }, [])

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
          <CTableBody></CTableBody>
        </CTable>
      </CCardBody>
    </div>
  )
}

export default AllTables

//  {
//    items && items.length !== 0
//      ? items.map((item, i) => {
//          return (
//            <CTableRow key={item.id}>
//              <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
//              <CTableDataCell>{`${item.name}`}</CTableDataCell>
//              <CTableDataCell className="d-flex ">
//                <Link
//                  className={` btn btn-sm btn-danger`}
//                  onClick={() => {
//                    return deleteStockItem(item.id)
//                  }}
//                >
//                  Delete
//                </Link>
//              </CTableDataCell>
//            </CTableRow>
//          )
//        })
//      : null
//  }
