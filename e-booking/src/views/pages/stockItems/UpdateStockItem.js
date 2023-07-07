import { useSelector } from 'react-redux'
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
  CFormSelect,
  CRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import BackButton from 'src/components/Navigating/BackButton'

const UpdateStockItem = () => {
  const { register, handleSubmit, reset } = useForm()
  const item = useSelector((state) => state.selection.selected)
  const [stores, setStores] = useState([])

  const updateItem = async (data) => {
    await instance
      .put('/stock/item/update', data)
      .then((res) => {
        if (res.data.data) {
          toast.success('item update successfully')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const onSubmit = (data) => {
    updateItem({ id: item.id, ...data })
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
          <BackButton />
          <CCard className="mb-4">
            <CCardHeader>
              <h2>
                <strong> Update item </strong>
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
                      defaultValue={item.name}
                      placeholder="... "
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
                      {...register('storeId', { required: true })}
                    >
                      {stores && stores.length !== 0
                        ? stores.map((store) => (
                            <option
                              value={store.id}
                              selected={item.Store.id === store.id}
                            >
                              {store.name}
                            </option>
                          ))
                        : null}
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CCol xs={12}>
                  <CButton
                    component="input"
                    type="submit"
                    value="Update item"
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

export default UpdateStockItem
