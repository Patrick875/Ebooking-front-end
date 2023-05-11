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
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { instance } from 'src/API/AxiosInstance'

const StockItemAdd = () => {
  const { register, handleSubmit, reset } = useForm()
  const dispatch = useDispatch()
  const [stores, setStores] = useState([])

  const onSubmit = (data) => {
    dispatch(addStockItem(data))
    reset()
  }

  useEffect(() => {
    const getAllStores = async () => {
      await instance.get('/stock/store/all').then((res) => {
        setStores(res.data.data)
      })
    }
    getAllStores()
  }, [])
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2>
                <strong> Create stock item </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                name="stockItemAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <CRow className="d-flex justify-content-between">
                  <CCol md={6} className="mb-3">
                    <CFormLabel htmlFor="name"> Item name </CFormLabel>
                    <CFormInput
                      type="text"
                      name="name"
                      id="name"
                      placeholder="....meat "
                      size="md"
                      {...register('name', { required: true })}
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormLabel htmlFor="name"> Store </CFormLabel>
                    <CFormSelect
                      type="text"
                      name="store"
                      id="storeId"
                      placeholder="....store "
                      size="md"
                      {...register('storeId', { required: true })}
                    >
                      {stores && stores.length !== 0
                        ? stores.map((store) => (
                            <option value={store.id}>{store.name}</option>
                          ))
                        : null}
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CCol xs={12}>
                  <CButton
                    component="input"
                    type="submit"
                    value="Create item"
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

export default StockItemAdd
