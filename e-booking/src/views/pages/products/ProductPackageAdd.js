import {
  CButton,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CCard,
  CRow,
  CCardHeader,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

import { instance } from 'src/API/AxiosInstance'

const MultiStepForm = () => {
  const { register, handleSubmit } = useForm()
  const [category, setCategory] = useState([])
  const [categories, setCategories] = useState([])

  const onSubmit = async (data) => {
    data = { ...data, category: category[0].id }
    await instance
      .post('/packages/add', data)
      .then((res) => {
        toast.success('package created')
      })
      .catch((err) => {
        console.log(err.message)
      })
  }
  useEffect(() => {
    const getCategories = async () => {
      await instance
        .get('/products/category/all')
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data.data)
            setCategories(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }

    getCategories()
  }, [])

  return (
    <CCard>
      <CCardHeader className="text-center lead fw-bold">
        Create product package
      </CCardHeader>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCardBody>
          <CRow>
            <CCol md={6}>
              <CFormLabel htmlFor="price">Package name</CFormLabel>
              <CFormInput
                type="text"
                name="name"
                id="name"
                placeholder="...package name"
                {...register('name')}
              />
            </CCol>

            <CCol md={6}>
              <CFormLabel htmlFor="category">Package category</CFormLabel>
              <Typeahead
                id="basic-typeahead-single"
                filterBy={['name']}
                labelKey="name"
                onChange={setCategory}
                options={categories}
                placeholder="category name..."
                selected={category}
              />
              {category && category.length === 0 ? (
                <p className="text-danger ">Package categoty is required</p>
              ) : null}
            </CCol>
          </CRow>
          <div className="my-3 d-flex justify-content-end gap-2">
            <CButton type="submit" className="" disable={category.length === 0}>
              Submit
            </CButton>
          </div>
        </CCardBody>
      </CForm>
    </CCard>
  )
}

export default MultiStepForm
