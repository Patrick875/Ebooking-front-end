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

function ProformaInvoice() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, watch } = useForm()
  const query = watch('query') || ''

  let [invoices, setInvoices] = useState([])

  const perpage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleOnRowClick = async (item) => {
    dispatch(selectItem(item))
    navigate('/booking/accounting/proformainvoice/view')
  }
  if (query && query !== '') {
    invoices = invoices.filter((invoice) =>
      invoice.proformaGenerated.toLowerCase().includes(query.toLowerCase()),
    )
  }

  useEffect(() => {
    const getAllInvoice = async () => {
      await instance.get('/proforma/all').then((res) => {
        setInvoices(res.data.data)
        console.log('cool', res.data.data)
      })
    }

    getAllInvoice()
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
                to="/booking/accounting/proformainvoice/create"
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
                    placeholder="by id/no ..."
                    {...register('query')}
                  />
                </div>
              </form>
            </div>
          </CCol>
          <p className="text-center fs-4">
            <strong> All Pro forma invoices </strong>
          </p>
          <CTable bordered hover={true}>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">id</CTableHeaderCell>
                <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Client </CTableHeaderCell>
                <CTableHeaderCell scope="col">Function</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {invoices && invoices.length !== 0
                ? invoices
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
                        <CTableDataCell>{el.proformaGenerated}</CTableDataCell>
                        <CTableDataCell>
                          {new Date(el.createdAt).toLocaleDateString()}
                        </CTableDataCell>
                        <CTableDataCell>{el.clientName}</CTableDataCell>
                        <CTableDataCell>{el.function}</CTableDataCell>
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
            totalPosts={invoices.length}
            paginate={paginate}
          />
        </CRow>
      </CCardBody>
    </div>
  )
}

export default ProformaInvoice
