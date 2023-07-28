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
import { RiCheckLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import BackButton from 'src/components/Navigating/BackButton'
import { selectItem } from 'src/redux/Select/selectionActions'

function AllBarRequest() {
  let [items, setItems] = useState([])
  const petitStock = useSelector((state) => state.selection.selectedPetitStock)
  items =
    items && items.length !== 0 && petitStock
      ? items.filter((item) => item.petitStockId === petitStock.id)
      : []
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleOnRowClick = async (item) => {
    dispatch(selectItem(item))
    navigate('/booking/stock/request/out/view')
  }
  useEffect(() => {
    const getPetitStockOrders = async () => {
      await instance
        .get('/petitstock/order/all')
        .then((res) => {
          console.log(res.data)
          setItems(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getPetitStockOrders()
  }, [])

  console.log('requests', items)

  return (
    <div>
      <CCardHeader>
        <BackButton />
        <div className="d-flex">
          <h2 className="col text-center">
            <strong>
              {' '}
              All requests from {petitStock ? petitStock.name : ''} to stock
            </strong>
          </h2>
        </div>
      </CCardHeader>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col">Approval</CTableHeaderCell>
              <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {items && items.length !== 0
              ? items.map((item, i) => {
                  return (
                    <CTableRow
                      key={item.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        return handleOnRowClick(item)
                      }}
                    >
                      <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                      <CTableDataCell>
                        {new Date(item.date).toLocaleDateString('fr-FR')}
                      </CTableDataCell>
                      <CTableDataCell className="d-flex">
                        {item && item.status === 'APPROVED' ? (
                          <p className="ms-2">
                            Approved
                            <RiCheckLine className="ms-3 text-success" />
                          </p>
                        ) : null}
                      </CTableDataCell>
                      <CTableHeaderCell>
                        {item.total.toLocaleString()}
                      </CTableHeaderCell>
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

export default AllBarRequest
