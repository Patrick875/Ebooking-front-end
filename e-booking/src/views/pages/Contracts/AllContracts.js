import {
  CCardBody,
  CCol,
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
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IoCreateOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux'

import { Link, useNavigate } from 'react-router-dom'
import { instance } from 'src/API/AxiosInstance'
import { selectItem } from 'src/redux/Select/selectionActions'
import Pagination from 'src/utils/Pagination'

function AllContracts() {
  // const dispatch = useDispatch()
  // const navigate = useNavigate()
  const { register, watch } = useForm()
  const query = watch('query') || ''

  // let [bonDeCommandes, setBonDeCommandes] = useState([])
  // const perpage = 10
  // const [currentPage, setCurrentPage] = useState(1)
  // const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // const handleOnRowClick = async (item) => {
  //   dispatch(selectItem(item))
  //   navigate('/booking/accounting/bon-de-commande/view')
  // }
  if (query && query !== '') {
  }
  useEffect(() => {
    // const getAllBonDeCommande = async () => {
    //   await instance.get('/bonDeCommand/all').then((res) => {
    //     setBonDeCommandes(res.data.data)
    //   })
    // }
    // getAllBonDeCommande()
  }, [])
  return (
    <div>
      <CCardBody>
        <CRow>
          <CCol className="col d-flex justify-content-between">
            <div>
              <form>
                <div>
                  <CFormLabel className="text-center">Search</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="id"
                    id="id/no"
                    placeholder="by client name"
                    {...register('query')}
                  />
                </div>
              </form>
            </div>
          </CCol>
          <p className="text-center fs-4">
            <strong> All Contracts </strong>
          </p>
          <CTable bordered hover={true}>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Client</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tel</CTableHeaderCell>
                <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                <CTableHeaderCell scope="col">From</CTableHeaderCell>
                <CTableHeaderCell scope="col">To</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody></CTableBody>
          </CTable>
        </CRow>
      </CCardBody>
    </div>
  )
}

export default AllContracts

//  <Pagination
//             postsPerPage={perpage}
//             totalPosts={bonDeCommandes.length}
//             paginate={paginate}
//           />
