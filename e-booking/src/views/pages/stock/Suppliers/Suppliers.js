import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { instance } from 'src/API/AxiosInstance'
import { useEffect, useState } from 'react'
import { selectItem } from 'src/redux/Select/selectionActions'
import { useNavigate } from 'react-router-dom'

const Suppliers = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState([])
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const handleOnRowClick = async (item) => {
    dispatch(selectItem(item))
    navigate('/booking/stock/suppliers/view')
  }
  useEffect(() => {
    const getAllSuppliers = async () => {
      await instance
        .get('supply/all-suppliers')
        .then((res) => {
          if (res && res.data && res.data.data) {
            setSuppliers(res.data.data)
          }
        })
        .catch((er) => {
          console.log('err', er)
        })
    }
    getAllSuppliers()
  }, [])

  return (
    <div>
      <div className="d-flex justify-content-center">
        <CButton
          onClick={() => {
            navigate('/booking/stock/suppliers/create')
          }}
        >
          Create
        </CButton>
      </div>
      <div>
        <CTable bordered hover={true}>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Name</CTableHeaderCell>
              <CTableHeaderCell scope="col">Tel</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {suppliers && suppliers.length !== 0
              ? suppliers
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
                  .map((el, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>
                        {' '}
                        {(currentPage - 1) * perpage + 1 + i}
                      </CTableDataCell>
                      <CTableDataCell
                        onClick={() => {
                          handleOnRowClick(el)
                        }}
                      >
                        {el.name}
                      </CTableDataCell>
                      <CTableDataCell>{el.Tel}</CTableDataCell>
                    </CTableRow>
                  ))
              : ''}
          </CTableBody>
        </CTable>
      </div>
    </div>
  )
}

export default Suppliers
