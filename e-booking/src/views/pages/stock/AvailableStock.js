import {
  CButton,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
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
import { instance } from 'src/API/AxiosInstance'

import Pagination from 'src/utils/Pagination'

function ItemDetailsModal(props) {
  let { open, setOpen, item } = props
  const { register, handleSubmit } = useForm()
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const trackItem = async (item) => {
    await instance
      .get(
        `/stock/track/item/item=${item.id}&date_from=${startDate}&date_to=${endDate}`,
      )
      .then(() => {
        toast.success('item details retrieved')
      })
      .catch((err) => {
        toast.error('item details retrieve failed')
        console.log('err', err)
      })
  }

  return (
    <React.Fragment>
      <CModal
        size="lg"
        alignment="center"
        visible={open}
        onClose={() => setOpen(false)}
      >
        <CForm>
          <CModalHeader>
            <CModalTitle className="text-center">Select date range</CModalTitle>
          </CModalHeader>
          <div className="ms-3 d-flex gap-2">
            <div className="col-4">
              <CFormInput
                className="form-control col px-2"
                id="start"
                name="start-date"
                onChange={(e) => setStartDate(e.target.value)}
                startDate={startDate}
                type="date"
              />
            </div>
            <div className="col-4">
              <CFormInput
                id="end"
                name="end-date"
                onChange={(e) => setEndDate(e.target.value)}
                startDate={endDate}
                type="date"
              />
            </div>
          </div>
          <CModalBody></CModalBody>
          <CModalFooter>
            <button
              className="btn btn-primary"
              onClick={() => {
                trackItem(item)
              }}
            >
              Submit
            </button>
          </CModalFooter>
        </CForm>
      </CModal>
    </React.Fragment>
  )
}

function AvailableStock() {
  const { register, watch } = useForm()
  const query = watch('query') || ''
  const [clicked, setClicked] = useState({})
  const [open, setOpen] = useState(false)

  const searchItems = (items, query) => {
    if (!query || query === '') {
      return items
    } else {
      return items.filter((item) =>
        item.StockItem.name.toLowerCase().includes(query),
      )
    }
  }
  let [items, setItems] = useState([])

  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const [style, setStyle] = useState({ display: 'none' })
  items = searchItems(items, query)
  useEffect(() => {
    const getItems = async () => {
      await instance
        .get('/stock/item/balance')
        .then((res) => {
          setItems(res.data.data)
          console.log('available stock', res.data.data)
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
          <strong> Available stock </strong>
        </h2>
      </CCardHeader>
      <CCardBody>
        <div className="col-md-4">
          <CFormLabel className="text-center">Search</CFormLabel>
          <CFormInput
            className="mb-1"
            type="text"
            name="stockItemName"
            id="stockItemName"
            size="md"
            placeholder="by  item name ..."
            {...register('query')}
          />
        </div>

        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
              <CTableHeaderCell scope="col">Unit price</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items && items.length !== 0
              ? items
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
                        <CTableDataCell scope="row">
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableDataCell>
                        <CTableDataCell>{item.StockItem.name}</CTableDataCell>
                        <CTableDataCell>{item.quantity}</CTableDataCell>
                        <CTableDataCell
                          onMouseEnter={(e) => {
                            setStyle({ display: 'block' })
                          }}
                          onMouseLeave={(e) => {
                            setStyle({ display: 'none' })
                          }}
                          className="d-flex  gap-2"
                        >
                          {item.price}

                          <div
                            className="btn btn-primary btn-sm"
                            style={style}
                            onClick={() => {
                              setClicked(item)
                              return setOpen(true)
                            }}
                          >
                            Track item
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })
              : null}
          </CTableBody>
        </CTable>
        <ItemDetailsModal open={open} setOpen={setOpen} item={clicked} />
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

export default AvailableStock
