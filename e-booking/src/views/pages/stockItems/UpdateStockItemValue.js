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
  CRow,
} from '@coreui/react'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import BackButton from 'src/components/Navigating/BackButton'
import { useState } from 'react'

const UpdateStockItemValue = () => {
  const { register, handleSubmit, reset } = useForm()
  const item = useSelector((state) => state.selection.selectedStockItem)
  const [itemData, setItemData] = useState()
  const updateItem = async (data) => {
    await instance
      .post('/stock/item/updateItemValue', data)
      .then((res) => {
        if (res.data.data) {
          toast.success('item update successfully')
          if (res.data.data) {
            setItemData(res.data.data)
          }
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
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <BackButton />
          <CCard className="mb-4">
            <CCardHeader>
              <h2>
                <strong> Update item value </strong>
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
                      defaultValue={
                        itemData
                          ? itemData.StockItemNew.name
                          : item.StockItemNew.name
                      }
                      placeholder="... "
                      {...register('name', { required: true })}
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormLabel htmlFor="quantity"> Quantity </CFormLabel>
                    <CFormInput
                      type="number"
                      name="quantity"
                      id="quantity"
                      defaultValue={
                        itemData ? itemData.quantity : item.quantity
                      }
                      {...register('quantity', { required: true })}
                    />
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <CFormLabel htmlFor="price"> Price </CFormLabel>
                    <CFormInput
                      type="number"
                      name="price"
                      id="price"
                      defaultValue={itemData ? itemData.price : item.price}
                      {...register('price', { required: true })}
                    />
                  </CCol>
                </CRow>

                <CCol xs={12}>
                  <CButton
                    component="input"
                    type="submit"
                    disabled={itemData}
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

export default UpdateStockItemValue
