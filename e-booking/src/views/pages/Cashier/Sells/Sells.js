import { CCardBody, CCardHeader } from '@coreui/react'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useForm } from 'react-hook-form'
import ReactToPrint from 'react-to-print'
import { instance } from 'src/API/AxiosInstance'
import CalendarContainer from 'src/utils/CalendarContainer'
import Pagination from 'src/utils/Pagination'
import {
  datesInRangeWithUnix,
  getUTCDateWithoutHours,
} from 'src/utils/functions'
import SellsTable from './SellsTable'
import PrintTemplate1 from '../../Printing/PrintTemplate1'
import dayjs from 'dayjs'

const Sells = () => {
  const componentRef = useRef()
  let stuff = []
  const { register, watch } = useForm()
  const [sells, setSells] = useState([])
  const [petitStock, setPetitStock] = useState([])
  const [serviceSells, setServiceSells] = useState([])
  const time = watch('time')
  const type = watch('type')
  const pos = watch('pos')
  const perpage = 14
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const onChange = (dates) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }
  let myDates = datesInRangeWithUnix(startDate, endDate)
  const filterSells = (sells) => {
    return type === 'product'
      ? sells.filter((sell) => sell.petitStock)
      : type === 'service'
      ? sells.filter((sell) => sell.Service)
      : sells
  }
  const filterByPos = (sells, pos) => {
    return pos === 'all'
      ? sells
      : sells.filter((sell) =>
          sell.petitStock
            ? sell.petitStock.name === pos
            : sell.Service.name === pos,
        )
  }
  let confirmedSells = useMemo(() => {
    return sells && sells.length !== 0
      ? sells.filter((sell) => sell.status.toLowerCase().includes('comfirmed'))
      : []
  })
  confirmedSells = [...confirmedSells, ...serviceSells]

  confirmedSells = useMemo(() => filterSells(confirmedSells), [confirmedSells])
  confirmedSells = useMemo(
    () => filterByPos(confirmedSells, pos),
    [confirmedSells, pos],
  )
  if (
    confirmedSells &&
    confirmedSells.length !== 0 &&
    myDates &&
    myDates.length !== 0 &&
    time !== 'all-time'
  ) {
    confirmedSells = confirmedSells.filter((sell) => {
      const sellDate = dayjs(sell.date || sell.updatedAt).format('DD/MM/YYYY')
      return myDates.includes(sellDate) ? sell : false
    })
  } else {
    stuff =
      confirmedSells && confirmedSells.length !== 0
        ? confirmedSells.filter((el, i) => {
            if (currentPage === 1) {
              return i >= 0 && i < perpage ? el : null
            } else {
              return i >= (currentPage - 1) * perpage &&
                i <= perpage * currentPage - 1
                ? el
                : null
            }
          })
        : []
  }

  const total =
    confirmedSells && confirmedSells.length !== 0
      ? confirmedSells.reduce(
          (acc, curr) => acc + (curr.amount ? curr.amount : curr.total),
          0,
        )
      : 0
  const cashTotal =
    confirmedSells && confirmedSells.length !== 0
      ? confirmedSells.reduce(
          (acc, curr) => acc + Number(curr.paymentMethod.CASH),
          0,
        )
      : 0
  const momoTotal =
    confirmedSells && confirmedSells.length !== 0
      ? confirmedSells.reduce(
          (acc, curr) => acc + Number(curr.paymentMethod.MOMO),
          0,
        )
      : 0
  const posTotal =
    confirmedSells && confirmedSells.length !== 0
      ? confirmedSells.reduce(
          (acc, curr) => acc + Number(curr.paymentMethod.POS),
          0,
        )
      : 0

  useEffect(() => {
    const getItems = async () => {
      await instance.get('/products/package/sells').then((res) => {
        if (res.data && res.data.data) {
          setSells(res.data.data)
          console.log('res', res.data.data)
        }
      })
    }
    const getServiceSells = async () => {
      await instance
        .get('/services/sells')
        .then((res) => {
          if (res.data && res.data.data) {
            setServiceSells(res.data.data)
            console.log(res.data.data)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    const getAllPetitStock = async () => {
      await instance
        .get('/petit-stock/all')
        .then((res) => {
          if (res.datad && res.data.data) {
            setPetitStock(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.statusCode)
        })
    }
    getAllPetitStock()
    getServiceSells()
    getItems()
  }, [])

  return (
    <React.Fragment>
      <CCardHeader>
        <div className="my-2">
          <div className="d-flex justify-content-between">
            <h2 className="row">
              <strong> All sales </strong>
            </h2>

            <div>
              <ReactToPrint
                trigger={() => (
                  <button className="btn btn-ghost-primary">Print</button>
                )}
                content={() => componentRef.current}
              />
            </div>
          </div>
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
            <div className="col-3">
              <div className="col">
                <label className="text-center py-1">Type</label>
                <select
                  className="form-select form-select-sm col"
                  aria-label=" sell type select"
                  defaultValue={'all'}
                  {...register('type')}
                >
                  <option value="all">All</option>
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <div style={{ display: 'none' }}>
          <div ref={componentRef}>
            <PrintTemplate1>
              <p className="text-center fw-bold">Sells Report</p>
              <SellsTable
                confirmedSells={
                  myDates.length !== 0 && time !== 'all-time'
                    ? confirmedSells
                    : stuff
                }
                perpage={perpage}
                currentPage={currentPage}
                total={total}
              />
            </PrintTemplate1>
          </div>
        </div>
        <SellsTable
          confirmedSells={
            myDates.length !== 0 && time !== 'all-time' ? confirmedSells : stuff
          }
          perpage={perpage}
          currentPage={currentPage}
          total={total}
          cashTotal={cashTotal}
          momoTotal={momoTotal}
          posTotal={posTotal}
        />

        {confirmedSells ? (
          <Pagination
            postsPerPage={perpage}
            totalPosts={confirmedSells.length}
            paginate={paginate}
          />
        ) : null}
      </CCardBody>
    </React.Fragment>
  )
}

export default Sells
