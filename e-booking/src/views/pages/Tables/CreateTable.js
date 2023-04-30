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

const CreateTable = () => {
  const { register, handleSubmit, reset } = useForm()
  const dispatch = useDispatch()
  const onSubmit = (data) => {
    //  dispatch(addStockItem(data))
    //reset()
  }
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2>
                <strong> Create Table </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                name="tableAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="number"> Table number </CFormLabel>
                  <CFormInput
                    type="number"
                    name="number"
                    id="number"
                    placeholder="....table number"
                    size="md"
                    {...register('number', { required: true })}
                  />
                </CCol>
                <CCol xs={12}>
                  <CButton
                    component="input"
                    type="submit"
                    value="Create table"
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

export default CreateTable
