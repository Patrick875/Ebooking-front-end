import {
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormSelect,
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
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectItem } from 'src/redux/Select/selectionActions'
import Pagination from 'src/utils/Pagination'
import { sortingWithDates } from 'src/utils/functions'

function AllPosBills() {
  const { register, watch } = useForm()
  const query = watch('query') || ''
  const stockId = watch('stockId') || null
  const [petitStock, setPetitStock] = useState([])
  let [items, setItems] = useState([])
  const role = useSelector((state) => state.auth.role)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [deleted, setDeleted] = useState()
  const searchWaiters = (items, query) => {
    if (!query || query === '') {
      return items
    } else {
      return items.filter(
        (item) =>
          item.User.firstName.toLowerCase().includes(query.toLowerCase()) ||
          item.User.lastName.toLowerCase().includes(query.toLowerCase()),
      )
    }
  }
  const filterBills = (items, petiStockId) => {
    if (!petiStockId || petiStockId === '') {
      return items
    } else {
      return items.filter((item) => item.petiStockId == petiStockId)
    }
  }

  const deletePosCustomerBill = async (id) => {
    await instance.post('/posbondecommande/delete/', { id }).then((res) => {
      setDeleted(res)
      toast.success('Bon de commande deleted!!!!')
    })
  }
  const perpage = 30
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  useEffect(() => {
    const getItems = async () => {
      await instance
        .get('/posbondecommande/all')
        .then((res) => {
          setItems(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    const getAllPetitStock = async () => {
      await instance
        .get('/petit-stock/all')
        .then((res) => {
          setPetitStock(res.data.data)
        })
        .catch((err) => {
          console.log(err.statusCode)
        })
    }
    getAllPetitStock()
    getItems()
  }, [deleted])

  items = searchWaiters(items, query)
  items = filterBills(items, stockId)
  return (
    <div>
      <CCardHeader className="text-center">
        <h2>
          <strong> Pos Bon de Commande Bills </strong>
        </h2>
      </CCardHeader>
      <CCardBody>
        <form className="d-flex justify-content-between">
          <div className="col-md-4">
            <CFormInput
              className="mb-1"
              type="text"
              name="itemName"
              id="itemName"
              placeholder="search by waiter ..."
              {...register('query')}
            />
          </div>
          <div className="col-md-4">
            <CFormSelect
              name="store"
              id="store"
              className="mb-3"
              aria-label="store"
              {...register('stockId', { required: true })}
            >
              <option value="" selected={true}>
                All
              </option>
              {petitStock.length !== 0
                ? petitStock.map((stock) => (
                    <option value={stock.id} className="text-capitalize">
                      {stock.name}
                    </option>
                  ))
                : null}
            </CFormSelect>
          </div>
        </form>

        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Account</CTableHeaderCell>
              <CTableHeaderCell scope="col">Posted By</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
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
                      <CTableRow key={item.id}>
                        <CTableHeaderCell scope="row">
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableHeaderCell>
                        <CTableDataCell
                          onClick={() => {
                            dispatch(selectItem(item))
                            navigate('/cashier/posbonbills/view')
                          }}
                        >
                          {item.PetitStock ? item.PetitStock.name : ''}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.User
                            ? item.User.firstName + ' ' + item.User.lastName
                            : ''}
                        </CTableDataCell>
                        <CTableDataCell>{item.amount}</CTableDataCell>
                        <CTableDataCell>
                          {role && role === 'admin' ? (
                            <Link
                              className={` btn btn-sm btn-danger`}
                              onClick={() => {
                                return deletePosCustomerBill(item.id)
                              }}
                            >
                              Delete
                            </Link>
                          ) : null}
                        </CTableDataCell>
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
    </div>
  )
}

export default AllPosBills
