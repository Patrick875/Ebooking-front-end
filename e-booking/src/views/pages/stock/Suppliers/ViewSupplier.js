import {
  CButton,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import BackButton from 'src/components/Navigating/BackButton'

function ViewSupplier() {
  const selectedSupplier = useSelector((state) => state.selection.selected)
  const [selectedList, setSelectedList] = useState()
  const handleOnRowClick = (el) => {
    setSelectedList(el)
    console.log('el', el)
  }
  useEffect(() => {
    const getSupplyLists = async () => {
      await instance
        .get('/supply/all-lists')
        .then((res) => {
          if (res && res.data && res.data.data) {
            console.log('supply lists', res.data.data)
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
    getSupplyLists()
  }, [])
  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        {selectedList ? (
          <CButton
            style={{ backgroundColor: 'black' }}
            onClick={() => {
              setSelectedList(false)
            }}
          >
            Return to supply lists
          </CButton>
        ) : null}
      </div>

      <CCardBody>
        <div className="my-3 p-3" style={{ border: '2px solid black' }}>
          <div>
            <div className="col my-0 py-0">
              <p className="fw-bold my-0 py-0">
                {' '}
                Name :{selectedSupplier.name}{' '}
              </p>
              <p className="fw-bold my-0 py-0"> Tel :{selectedSupplier.Tel} </p>
            </div>
          </div>
        </div>
        {selectedList && Object.keys(selectedList).length !== 0 ? (
          <CRow>
            <p className="text-center fw-bold">
              Supply list of{' '}
              {new Date(selectedList.date).toLocaleDateString('fr-FR')}
            </p>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Item name </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Quantity </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {selectedList.SupplierListDetails &&
                selectedList.SupplierListDetails.length !== 0
                  ? selectedList.SupplierListDetails.map((el, i) => (
                      <CTableRow
                        onClick={() => {
                          handleOnRowClick(el)
                        }}
                      >
                        <CTableDataCell>{i + 1}</CTableDataCell>
                        <CTableDataCell>
                          {el.StockItemValue.StockItemNew.n}
                        </CTableDataCell>
                        <CTableDataCell>{el.quantity}</CTableDataCell>
                      </CTableRow>
                    ))
                  : null}
              </CTableBody>
            </CTable>
          </CRow>
        ) : null}
        {!selectedList ? (
          <CRow>
            <div>
              <CTable bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col"> Date </CTableHeaderCell>
                    <CTableHeaderCell scope="col"> Total </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {selectedSupplier.SupplierLists &&
                  selectedSupplier.SupplierLists.length !== 0
                    ? selectedSupplier.SupplierLists.map((el, i) => (
                        <CTableRow
                          onClick={() => {
                            handleOnRowClick(el)
                          }}
                        >
                          <CTableDataCell>{i + 1}</CTableDataCell>
                          <CTableDataCell>
                            {new Date(el.date).toLocaleDateString('fr-FR')}
                          </CTableDataCell>
                          <CTableDataCell>
                            {Number(el.total).toLocaleString()}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    : null}
                </CTableBody>
              </CTable>
            </div>
          </CRow>
        ) : null}
      </CCardBody>
    </div>
  )
}

export default ViewSupplier
