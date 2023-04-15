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

import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import { useDispatch } from 'react-redux'
import { CATEGORY_ACTIONS } from 'src/redux/Categories/categoriesActionTypes'
import { toast } from 'react-hot-toast'

const ProductCategoryAdd = () => {
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const createCategory = async (payload) => {
    await instance
      .post(`/products/category/add`, payload)
      .then((res) => {
        dispatch({
          type: CATEGORY_ACTIONS.CREATE_PRODUCT_CATEGORY,
          payload: res.data.data,
        })
        toast.success('product category created')
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }
  const onSubmit = (data) => {
    console.log('this is category data', data)
    createCategory(data)
    // reset()
  }
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2>
                <strong> Add Product Category </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                name="roomClassAddFrm"
                onSubmit={handleSubmit(onSubmit)}
                encType="multipart/form"
              >
                <CCol md={6} className="mb-3">
                  <CFormLabel htmlFor="name"> Category name </CFormLabel>
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
                    value="Create category"
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

export default ProductCategoryAdd
