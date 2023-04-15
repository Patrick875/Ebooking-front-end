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
  CRow,
} from '@coreui/react'

const StockItemAdd = () => {
  const { register, handleSubmit, reset } = useForm()
  const dispatch = useDispatch()
  const onSubmit = (data) => {
    dispatch(addStockItem(data))
    reset()
  }
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2>
                <strong> Stock Items </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                name="roomClassAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="name"> Item name </CFormLabel>
                  <CFormInput
                    type="text"
                    name="name"
                    id="name"
                    placeholder="meet "
                    size="md"
                    {...register('name', { required: true })}
                  />
                </CCol>
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
