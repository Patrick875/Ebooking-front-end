import {
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
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import { setCurrentStep } from 'src/redux/MultiStepForm/formActions'
import AdminProductAdd from './AdminProductAdd'
import { removeDuplicatesByName } from 'src/utils/functions'

function ProductAdd() {
  const { register, getValues, reset, handleSubmit, watch } = useForm()
  const dispatch = useDispatch()
  const [category, setCategory] = useState([])
  const [categories, setCategories] = useState([])
  const [packages, setPackages] = useState([])
  const [stockItems, setStockItems] = useState([])
  const [item, setItem] = useState([])
  const [packageItems, setPackageItems] = useState([])
  const onSubmit = async (data) => {
    console.log('now')
  }
  useEffect(() => {
    dispatch(setCurrentStep(0))
    const getCategories = async () => {
      await instance
        .get('/products/category/all')
        .then((res) => {
          if (res.status === 200) {
            setCategories(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    const getStockItems = async () => {
      await instance
        .get('/stock/item/all')
        .then((res) => {
          setStockItems(res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }

    const getAllPackages = async () => {
      await instance
        .get('/packages/all')
        .then((res) => {
          if (res.status === 200) {
            setPackages(res.data.data)
          }
        })
        .catch((err) => {
          console.log(err.message)
        })
    }
    getAllPackages()

    getCategories()
    getStockItems()
  }, [])
  return (
    <CCard>
      <CCardHeader className="text-center lead fw-bold">
        Create product
      </CCardHeader>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCard className="px-3">
          <CRow>
            <CCol md={6}>
              <CFormLabel htmlFor="name">Name</CFormLabel>
              <CFormInput name="name" id="name" {...register('name')} />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="type">Measure</CFormLabel>
              <CFormSelect name="type" id="type" {...register('category')}>
                {packages && packages.length !== 0
                  ? removeDuplicatesByName(packages).map((pack, i) => (
                      <option key={i} value={pack.name}>
                        {pack.name}
                      </option>
                    ))
                  : null}
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="price">Price</CFormLabel>
              <CFormInput
                name="price"
                id="name"
                type="number"
                step="any"
                {...register('price')}
              />
            </CCol>
          </CRow>
        </CCard>
      </CForm>
    </CCard>
  )
}

export default ProductAdd

// Example usage:
