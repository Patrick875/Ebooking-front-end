import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { addStockItem } from '../../../redux/StockItem/StockItemActions'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

function ContractItemsList(props, ref) {
  const { items, setItems, documentTitle } = props
  const [style, setStyle] = useState({ display: 'none' })

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h3>
              <strong> {documentTitle ? documentTitle : ''} </strong>
            </h3>
          </CCardHeader>
          <CCardBody>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="ctable-header-cell-hash">
                    #
                  </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Item </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Price </CTableHeaderCell>
                  <CTableHeaderCell scope="col"> Maximum </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {items && items.length !== 0 ? (
                  items.map((added, index) => {
                    return (
                      <CTableRow key={index + 1}>
                        <CTableDataCell> {index + 1} </CTableDataCell>
                        <CTableDataCell>{added.itemName || ''}</CTableDataCell>
                        <CTableDataCell> {added.price}</CTableDataCell>
                        <CTableDataCell>
                          {' '}
                          {added.maximum}
                          <div
                            className="btn btn-danger btn-sm"
                            style={style}
                            onClick={() => {
                              setItems(
                                items.filter((item) =>
                                  item !== added ? item : null,
                                ),
                              )
                            }}
                          >
                            Delete item
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })
                ) : (
                  <CTableRow>
                    <CTableHeaderCell colSpan={6}>
                      {' '}
                      No items added
                    </CTableHeaderCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

function CreateContract() {
  const { register, handleSubmit, getValues, reset } = useForm()
  const [items, setItems] = useState([])
  const [products, setProducts] = useState([])

  const onAddItem = (item) => {
    setItems([...items, item])
  }
  //const dispatch = useDispatch()

  const onSubmit = (data) => {
    reset()
  }

  useEffect(() => {
    const getAllProducts = async () => {
      await instance
        .get('/products/all')
        .then((res) => {
          console.log('okay', res.data.data)
          if (res.status === 200) {
            setProducts(res.data.data)
          }
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }

    getAllProducts()
  }, [])
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2>
                <strong> Create contract</strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                name="stockItemAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <p className="fs-4 fw-bold">Contract validation</p>
                <CRow className="d-flex justify-content-between">
                  <CCol md={6} className="mb-1">
                    <CFormLabel htmlFor="startDate"> From</CFormLabel>
                    <CFormInput
                      type="date"
                      name="startDate"
                      id="startDate"
                      placeholder=". "
                      {...register('startDate', { required: true })}
                    />
                  </CCol>
                  <CCol md={6} className="mb-1">
                    <CFormLabel htmlFor="endDate"> To </CFormLabel>
                    <CFormInput
                      type="date"
                      name="endDate"
                      id="endDate"
                      placeholder="....telephone "
                      {...register('endDate', { required: true })}
                    />
                  </CCol>
                  <CRow>
                    <p className="fs-4 fw-bold">Address</p>
                    <CCol md={6} className="mb-1">
                      <CFormLabel htmlFor="address">
                        {' '}
                        Address 1 (cell/District){' '}
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        name="address"
                        id="address"
                        placeholder="....umurenge/akarere "
                        {...register('address1', { required: true })}
                      />
                    </CCol>
                    <CCol md={6} className="mb-1">
                      <CFormLabel htmlFor="address">
                        {' '}
                        Address 2(Province){' '}
                      </CFormLabel>
                      <CFormSelect
                        type="text"
                        name="address2"
                        id="address2"
                        placeholder="....province "
                        {...register('address2', { required: true })}
                      >
                        <option value="Kigali city">Kigali city</option>
                        <option value="East">East</option>
                        <option value="West">West</option>
                        <option value="South">South</option>
                        <option value="North">North</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                </CRow>
                <p className="fs-4 fw-bold">Client details</p>
                <CRow className="d-flex justify-content-between">
                  <CCol md={6} className="mb-1">
                    <CFormLabel htmlFor="name"> Client name </CFormLabel>
                    <CFormInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder=". "
                      {...register('clientName', { required: true })}
                    />
                  </CCol>
                  <CCol md={6} className="mb-1">
                    <CFormLabel htmlFor="address"> Telephone </CFormLabel>
                    <CFormInput
                      type="text"
                      name="telephone"
                      id="telephone"
                      placeholder="....telephone "
                      {...register('telephone', { required: true })}
                    />
                  </CCol>
                </CRow>
                <p className="fs-4 fw-bold">Contract items</p>
                <CRow className="d-flex justify-content-between">
                  <CCol md={6} className="mb-1">
                    <CFormLabel htmlFor="itemName"> Item name </CFormLabel>
                    <CFormSelect
                      type="text"
                      name="itemName"
                      id="itemName"
                      placeholder="....product or service "
                      {...register('itemName', { required: true })}
                    >
                      <option value="item1">...</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={6} className="mb-1">
                    <CFormLabel htmlFor="price"> Price </CFormLabel>
                    <CFormInput
                      type="number"
                      min={0}
                      name="price"
                      id="price"
                      placeholder="....RWF "
                      required
                      {...register('price')}
                    />
                  </CCol>

                  <CCol md={6} className="mb-1">
                    <CFormLabel htmlFor="maximum"> Maximum</CFormLabel>
                    <CFormInput
                      type="number"
                      name="maximum"
                      id="maximum"
                      min={0}
                      placeholder="....max items"
                      {...register('maximum')}
                    />
                  </CCol>
                </CRow>
                <CCol xs={12}>
                  <CButton
                    component="input"
                    onClick={() => {
                      const data = getValues()

                      onAddItem({
                        itemName: data.itemName,
                        price: data.price,
                        maximum: data.maximum,
                      })
                      reset(['itemName', 'price', 'maximum'])
                    }}
                    value="Add item"
                  />
                </CCol>

                <ContractItemsList items={items} setItems={setItems} />
                <CCol xs={12}>
                  <CButton
                    component="input"
                    onClick={() => {
                      const data = getValues()
                      delete data.itemName
                      delete data.price
                      delete data.price
                      console.log('cool', { ...data, items: items })
                    }}
                    value="Create contract"
                  />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default CreateContract

// onMouseEnter={(e) => {
//                             setStyle({ display: 'block' })
//                           }}
//                           onMouseLeave={(e) => {
//                             setStyle({ display: 'none' })
//                           }}
