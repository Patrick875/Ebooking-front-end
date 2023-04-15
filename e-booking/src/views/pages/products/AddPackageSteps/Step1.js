import { CRow, CCol, CFormLabel, CFormInput, CFormSelect } from '@coreui/react'

const Step1 = (props) => {
  const { register, categories, setCategory, category, watch } = props
  const categoryId = watch('category')
  const name = watch('name')
  return (
    <CRow>
      <CCol md={6}>
        <CFormLabel htmlFor="title"> Product title </CFormLabel>
        <CFormInput
          className="mb-1"
          type="text"
          name="name"
          id="name"
          size="md"
          required
          {...register('name')}
        />
      </CCol>
      <CCol md={6}>
        <CFormLabel htmlFor="category"> Product category </CFormLabel>
        <CFormSelect
          name="category"
          id="category"
          size="md"
          className="mb-3"
          aria-label="Room class"
          {...register('category', { required: true })}
        >
          <option>-- Select -- </option>
          {categories && categories.length !== 0
            ? categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))
            : null}
        </CFormSelect>
      </CCol>
    </CRow>
  )
}

export default Step1

// <CCol xs={12} className="text-center my-3">
//         <CButton
//           component="input"
//           type="submit"
//           value=" Save product details"
//         />
//       </CCol>
