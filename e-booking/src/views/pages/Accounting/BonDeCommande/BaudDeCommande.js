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

function BaudDeCommande() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, watch } = useForm()
  const query = watch('query') || ''

  let [bonDeCommandes, setBonDeCommandes] = useState([])
  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleOnRowClick = async (item) => {
    dispatch(selectItem(item))
    navigate('/booking/accounting/bon-de-commande/view')
  }
  if (query && query !== '') {
    bonDeCommandes = bonDeCommandes.filter((bonDeCommande) =>
      bonDeCommande.BonCommandeId.toLowerCase().includes(query.toLowerCase()),
    )
  }
  useEffect(() => {
    const getAllBonDeCommande = async () => {
      await instance.get('/bonDeCommand/all').then((res) => {
        setBonDeCommandes(res.data.data)
      })
    }
    getAllBonDeCommande()
  }, [])
  return (
    <div>
      <CCardBody>
        <CRow>
          <CCol className="col d-flex justify-content-between">
            <div>
              <Link
                md={4}
                className="btn btn-primary"
                to="/booking/accounting/bon-de-commande/create"
              >
                <IoCreateOutline className="fs-5" />
                Create
              </Link>
            </div>
            <div>
              <form>
                <div>
                  <CFormLabel className="text-center">Search</CFormLabel>
                  <CFormInput
                    className="mb-1"
                    type="text"
                    name="id"
                    id="id/no"
                    size="md"
                    placeholder="by id/no ..."
                    {...register('query')}
                  />
                </div>
              </form>
            </div>
          </CCol>
          <p className="text-center fs-4">
            <strong> All Bon de Commande </strong>
          </p>
          <CTable bordered hover={true}>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">id</CTableHeaderCell>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Function</CTableHeaderCell>
                <CTableHeaderCell scope="col">Company</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {bonDeCommandes && bonDeCommandes.length !== 0
                ? bonDeCommandes
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
                      <CTableRow
                        key={i}
                        onClick={() => {
                          handleOnRowClick(el)
                        }}
                      >
                        <CTableDataCell>
                          {' '}
                          {(currentPage - 1) * perpage + 1 + i}
                        </CTableDataCell>
                        <CTableDataCell>{el.BonCommandeId}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(el.date_from).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>{el.function}</CTableDataCell>
                        <CTableDataCell>{el.company}</CTableDataCell>
                        <CTableDataCell>
                          {Number(el.total).toLocaleString()}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                : ''}
            </CTableBody>
          </CTable>
          <Pagination
            postsPerPage={perpage}
            totalPosts={bonDeCommandes.length}
            paginate={paginate}
          />
        </CRow>
      </CCardBody>
    </div>
  )
}

export default BaudDeCommande
