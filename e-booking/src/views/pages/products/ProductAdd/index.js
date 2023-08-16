import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardTitle,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import { setCurrentStep } from 'src/redux/MultiStepForm/formActions'
import AdminProductAdd from './AdminProductAdd'
import glass from '../../../../assets/images/icons8-wine-glass-96.png'
import pitcher from '../../../../assets/images/pitcher_1108470.png'
import tot from '../../../../assets/images/shot.png'
import bottle from '../../../../assets/images/glass-bottle.png'
import halfbottle from '../../../../assets/images/half-bottle.jpg'
import cup from '../../../../assets/images/coffee.png'

function ProductAdd() {
  const { register, getValues, reset, handleSubmit, watch } = useForm()
  const dispatch = useDispatch()
  const [category, setCategory] = useState([])
  const [categories, setCategories] = useState([])
  const [stockItems, setStockItems] = useState([])
  const [item, setItem] = useState([])
  const [packageItems, setPackageItems] = useState([])
  const type = watch('type') || 'food'
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
          <CForm>
            <CRow className="p-3 ">
              <CCol md={6}>
                <CFormLabel>Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="name"
                  id="name"
                  {...register('name')}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Type</CFormLabel>
                <CFormSelect name="type" id="type" {...register('type')}>
                  <option value="food" selected={true}>
                    Food
                  </option>
                  <option value="beverage">Beverage</option>
                </CFormSelect>
              </CCol>
              {type === 'food' ? (
                <CCol md={6}>
                  <CFormLabel>Price</CFormLabel>
                  <CFormInput
                    type="number"
                    name="price"
                    id="price"
                    {...register('price')}
                  />
                </CCol>
              ) : (
                <div className="p-3 add-product-grid">
                  <div>
                    <CCard>
                      <div className="py-2 d-flex justify-content-center">
                        <img
                          className="img-sm"
                          alt="Cup"
                          src={cup}
                          style={{
                            width: '5em',
                            height: '5em',
                          }}
                        />
                      </div>
                      <CCardBody>
                        <p className="text-center fw-bold text-capitalize">
                          Cup
                        </p>
                        <CRow className="px-2">
                          <CFormLabel>Price</CFormLabel>
                          <CFormInput
                            type="number"
                            name="price"
                            id="price-cup"
                            {...register('packages.cup')}
                          />
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </div>
                  <div>
                    <CCard>
                      <div className="py-2 d-flex justify-content-center">
                        <img
                          className="img-sm"
                          alt="tot"
                          src={tot}
                          style={{
                            width: '5em',
                            height: '5em',
                          }}
                        />
                      </div>
                      <CCardBody>
                        <p className="text-center fw-bold text-capitalize">
                          Tot/Shot
                        </p>
                        <CRow className="px-2">
                          <CFormLabel>Price</CFormLabel>
                          <CFormInput
                            type="number"
                            name="price"
                            id="price-tot"
                            {...register('packages.tot')}
                          />
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </div>
                  <div>
                    <CCard>
                      <div className="py-2 d-flex justify-content-center">
                        <img
                          className="img-sm"
                          alt="glass"
                          src={glass}
                          style={{
                            width: '5em',
                            height: '5em',
                          }}
                        />
                      </div>
                      <CCardBody>
                        <p className="text-center fw-bold text-capitalize">
                          Glass
                        </p>
                        <CRow className="px-2">
                          <CFormLabel>Price</CFormLabel>
                          <CFormInput
                            type="number"
                            name="price"
                            id="price-glass"
                            {...register('packages.glass')}
                          />
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </div>
                  <div>
                    <CCard>
                      <div className="py-2 d-flex justify-content-center">
                        <img
                          className="img-sm"
                          alt="pitcher"
                          src={pitcher}
                          style={{
                            width: '5em',
                            height: '5em',
                          }}
                        />
                      </div>
                      <CCardBody>
                        <p className="text-center fw-bold text-capitalize">
                          Pitcher
                        </p>
                        <CRow className="px-2">
                          <CFormLabel>Price</CFormLabel>
                          <CFormInput
                            type="number"
                            name="price"
                            id="price-pitcher"
                            {...register('packages.pitcher')}
                          />
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </div>
                  <div>
                    <CCard>
                      <div className="py-2 d-flex justify-content-center">
                        <img
                          className="img-sm"
                          alt="half-bottle"
                          src={halfbottle}
                          style={{
                            width: '5em',
                            height: '5em',
                          }}
                        />
                      </div>
                      <CCardBody>
                        <p className="text-center fw-bold text-capitalize">
                          Half Bottle
                        </p>
                        <CRow className="px-2">
                          <CFormLabel>Price</CFormLabel>
                          <CFormInput
                            type="number"
                            name="price"
                            id="price-half-bottle"
                            {...register('packages.half-bottle')}
                          />
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </div>
                  <div>
                    <CCard>
                      <div className="py-2 d-flex justify-content-center">
                        <img
                          className="img-sm"
                          alt="bottle"
                          src={bottle}
                          style={{
                            width: '5em',
                            height: '5em',
                          }}
                        />
                      </div>
                      <CCardBody>
                        <p className="text-center fw-bold text-capitalize">
                          Bottle
                        </p>
                        <CRow className="px-2">
                          <CFormLabel>Price</CFormLabel>
                          <CFormInput
                            type="number"
                            name="price"
                            id="price-bottle"
                            {...register('packages.bottle')}
                          />
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </div>
                  <div>
                    <CCard>
                      <div className="py-2 d-flex justify-content-center">
                        <img
                          className="img-sm"
                          alt="bottle"
                          src={bottle}
                          style={{
                            width: '5em',
                            height: '5em',
                          }}
                        />
                      </div>
                      <CCardBody>
                        <p className="text-center fw-bold text-capitalize">
                          Bottle
                        </p>
                        <CRow className="px-2">
                          <CFormLabel>Price</CFormLabel>
                          <CFormInput
                            type="number"
                            name="price"
                            id="price-bottle"
                            {...register('packages.bottle')}
                          />
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </div>
                </div>
              )}
            </CRow>
          </CForm>
        </CCard>
      </CForm>
    </CCard>
  )
}

export default ProductAdd
