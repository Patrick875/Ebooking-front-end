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
import React, { useEffect, useMemo, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { RiCheckLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectItem } from 'src/redux/Select/selectionActions'
import CalendarContainer from 'src/utils/CalendarContainer'
import Pagination from 'src/utils/Pagination'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
  sortingWithDates,
} from 'src/utils/functions'

function AllStockRequests() {
  let stuff = []
  const dispatch = useDispatch()
  const navigate = useNavigate()
  let [items, setItems] = useState([])
  const [petitStock, setPetitStock] = useState([])
  const { register, watch } = useForm()
  const time = watch('time')
  const pos = watch('pos')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  let myDates = datesInRangeWithUnix(startDate, endDate)

  const filterByPos = (requests, pos) => {
    return pos === 'all'
      ? requests
      : requests.filter((request) => request.PetitStock.name === pos)
  }

  items = useMemo(() => filterByPos(items, pos), [items, pos])

  if (
    items &&
    items.length !== 0 &&
    myDates &&
    myDates.length !== 0 &&
    time !== 'all-time'
  ) {
    items = items.filter((request) =>
      myDates.includes(
        getUTCDateWithoutHours(request.date || request.updatedAt),
      )
        ? request
        : '',
    )
  }

  const handleOnRowClick = async (item) => {
    dispatch(selectItem(item))
    navigate('/booking/stock/request/out/view')
  }
  useEffect(() => {
    const getPurchaseOrders = async () => {
      await instance
        .get('/petitstock/order/all')
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
    getPurchaseOrders()
  }, [])

  return (
    <div>
      <CCardHeader>
        <h2>
          <strong> All out stock requests </strong>
        </h2>

        <div className="d-flex justify-content-between  ">
          <div className="col-3 d-flex gap-2 flex-wrap">
            <div className="col">
              <label className="text-center py-1">Time</label>
              <select
                className="form-select form-select-sm col"
                aria-label="Default select example"
                defaultValue={'all-time'}
                {...register('time')}
              >
                <option value="all-time">All-time</option>
                <option value="date">Date</option>
              </select>
            </div>
            {time && time === 'date' ? (
              <div className="col d-flex align-items-end ">
                <ReactDatePicker
                  className="form-control col px-2"
                  onChange={onChange}
                  startDate={startDate}
                  endDate={endDate}
                  dateFormat="dd/MM/yy"
                  selectsRange
                  portalId="root-portal"
                  popperPlacement="bottom-end"
                  popperContainer={CalendarContainer}
                  placeholderText="Select date range"
                />
              </div>
            ) : null}
          </div>
          <div className="col-3">
            <div className="col">
              <label className="text-center py-1">Point of Sale</label>
              <select
                className="form-select form-select-sm col"
                aria-label=" sell type select"
                defaultValue={'all'}
                {...register('pos')}
              >
                <option value="all">All</option>
                {petitStock && petitStock.length !== 0
                  ? petitStock.map((el, i) => (
                      <option value={el.name} key={i * 2}>
                        {el.name}
                      </option>
                    ))
                  : null}
              </select>
            </div>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Requested By</CTableHeaderCell>
              <CTableHeaderCell scope="col">From</CTableHeaderCell>
              <CTableHeaderCell scope="col">Approval</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
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
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          return handleOnRowClick(item)
                        }}
                      >
                        <CTableHeaderCell scope="row">
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableHeaderCell>
                        <CTableDataCell>
                          {new Date(item.date).toLocaleDateString('fr-FR')}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.User.firstName + ' ' + item.User.lastName}
                        </CTableDataCell>
                        <CTableDataCell>{item.PetitStock.name}</CTableDataCell>
                        <CTableDataCell>
                          {item.status === 'APPROVED' ? (
                            <p className="ms-3">
                              Approved
                              <RiCheckLine className=" ms-3 text-success ri-lg" />
                            </p>
                          ) : (
                            <p className="ms-3">{item.status}</p>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.total.toLocaleString()}
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

export default AllStockRequests
