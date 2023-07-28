import { CCard, CCardBody, CCardHeader, CForm } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import { setCurrentStep } from 'src/redux/MultiStepForm/formActions'
import AdminProductAdd from './AdminProductAdd'

function ProductAdd() {
  const { register, getValues, reset, handleSubmit, watch } = useForm()
  const dispatch = useDispatch()
  const [category, setCategory] = useState([])
  const [categories, setCategories] = useState([])
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
    getCategories()
    getStockItems()
  }, [])
  return (
    <CCard>
      <CCardHeader className="text-center lead fw-bold">
        Create product
      </CCardHeader>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCard>
          <AdminProductAdd
            categories={categories}
            category={category}
            setCategory={setCategory}
            stockItems={stockItems}
            item={item}
            setItem={setItem}
            register={register}
            watch={watch}
            getValues={getValues}
            packageItems={packageItems}
            setPackageItems={setPackageItems}
            onSubmit={onSubmit}
          />
        </CCard>
      </CForm>
    </CCard>
  )
}

export default ProductAdd
