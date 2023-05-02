import {
  CCardBody,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { BiCartDownload } from 'react-icons/bi'
import { BsFiles } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import BackButton from 'src/components/Navigating/BackButton'
function AllBarItems() {
  const petitStock =
    useSelector((state) => state.selection.selectedPetitStock) || {}

  return (
    <div>
      <BackButton />
      <CCardBody>
        <p className="text-center fs-3">{petitStock.name} stock</p>
        <CRow>
          <div className="d-flex justify-content-between my-3">
            <Link
              md={4}
              className="btn btn-primary"
              to="/booking/petitstock/request"
            >
              <BiCartDownload className="fs-5" /> Request item from stock
            </Link>
            <Link
              md={4}
              className="btn btn-primary"
              to="/booking/petit/request/all"
            >
              <BsFiles className="fs-5" /> All requests
            </Link>
          </div>
          <p className="text-center fs-4">
            <strong> Current stock </strong>
          </p>
          <CTable bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {petitStock &&
              petitStock.PetitStockItems &&
              petitStock.PetitStockItems.length !== 0
                ? petitStock.PetitStockItems.map((item, i) => {
                    return (
                      <CTableRow key={item.id}>
                        <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                        <CTableDataCell>{`${item.StockItem.name}`}</CTableDataCell>
                        <CTableDataCell>{`${item.quantinty}`}</CTableDataCell>
                      </CTableRow>
                    )
                  })
                : null}
            </CTableBody>
          </CTable>
        </CRow>
      </CCardBody>
    </div>
  )
}

export default AllBarItems
