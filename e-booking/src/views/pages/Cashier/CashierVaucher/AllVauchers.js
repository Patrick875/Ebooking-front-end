import {
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { IoCreateOutline } from 'react-icons/io5'

import { Link } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import Pagination from 'src/utils/Pagination'
import { sortingWithDates } from 'src/utils/functions'
import ViewCashierVaucher from './ViewCashierVaucher'

function AllVauchers() {
  const { register, watch } = useForm()
  const query = watch('query') || ''
  let [items, setItems] = useState([])

  const searchItems = (items, query) => {
    if (!query || query === '') {
      return items
    } else {
      return items.filter((item) =>
        item.doneTo.toLowerCase().includes(query.toLowerCase()),
      )
    }
  }

  const perpage = 30
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const [vaucher, setVaucher] = useState()
  const [viewVaucher, setViewVaucher] = useState(false)
  useEffect(() => {
    const getAllVauchers = async () => {
      await instance
        .get('/cashvaucher/all')
        .then((res) => {
          setItems(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    getAllVauchers()
  }, [])

  items = searchItems(items, query)

  return (
    <div>
      {viewVaucher ? (
        <ViewCashierVaucher vaucher={vaucher} setViewVaucher={setViewVaucher} />
      ) : (
        <React.Fragment>
          <CCardHeader>
            <form className="d-flex justify-content-between">
              <div>
                <Link
                  md={4}
                  className="btn btn-primary"
                  to="/booking/cashier/vauchers/create"
                >
                  <IoCreateOutline className="fs-5" />
                  Create
                </Link>
              </div>
              <div className="col-md-4">
                <CFormLabel>Search</CFormLabel>
                <CFormInput
                  className="mb-1"
                  type="text"
                  name="itemName"
                  id="itemName"
                  placeholder="search ..."
                  {...register('query')}
                />
              </div>
            </form>
          </CCardHeader>
          <h4 className="text-center">
            <strong> Cashier vauchers </strong>
          </h4>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Id</CTableHeaderCell>
                  <CTableHeaderCell scope="col">To/From</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Reason</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {items && items.length !== 0
                  ? sortingWithDates(items)
                      .filter((el, i) => {
                        if (currentPage === 1) {
                          return i >= 0 && i < perpage ? el : null
                        } else {
                          return i >= (currentPage - 1) * perpage &&
                            i <= perpage * currentPage - 1
                            ? el
                            : null
                        }
                      })
                      .map((item, i) => {
                        return (
                          <CTableRow
                            key={item.id}
                            onClick={() => {
                              setVaucher(item)
                              setViewVaucher(true)
                            }}
                          >
                            <CTableHeaderCell scope="row">
                              {new Date(item.date).toLocaleDateString()}
                            </CTableHeaderCell>
                            <CTableDataCell>{item.vaucherId}</CTableDataCell>
                            <CTableDataCell>{item.doneTo}</CTableDataCell>
                            <CTableDataCell>
                              {Number(item.amount).toLocaleString()}
                            </CTableDataCell>
                            <CTableDataCell>{item.description}</CTableDataCell>
                          </CTableRow>
                        )
                      })
                  : null}
              </CTableBody>
            </CTable>
            {items.length !== 0 ? (
              <Pagination
                postsPerPage={perpage}
                totalPosts={items.length}
                paginate={paginate}
              />
            ) : null}
          </CCardBody>
        </React.Fragment>
      )}
    </div>
  )
}

export default AllVauchers
