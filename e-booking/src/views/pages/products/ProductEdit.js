import React, { useEffect, useState } from 'react'
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
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import { selectItem } from 'src/redux/Select/selectionActions'
import PackageEditModal from './PackageEditModal'

function ProductEdit() {
  const selectedProduct =
    useSelector((state) => state.products.selectedProduct) || {}

  const [packages, setPackages] = useState([])
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const [allDataCategories, setAllDataCategories] = useState([])
  const role = useSelector((state) => state.auth.user.role)
  const [style, setStyle] = useState({ display: 'none' })
  const [visible, setVisible] = useState(false)
  const [productPackages, setProductPackages] = useState(
    selectedProduct.Packages,
  )

  // if(productPackages.length!==0){
  //   selectedProduct.Packages = [...selectedProduct.Packages, ...productPackages]
  // }

  const [stockItems, setStockItems] = useState([])
  const onSubmit = (data) => {
    console.log(data)
    //roomClass.push(formData);
  }
  const onManagerSubmit = (data) => {
    console.log(data, { role })
  }
  console.log('selected product', selectedProduct)
  useEffect(() => {
    const getAllCategories = async () => {
      await instance
        .get('/products/category/all')
        .then((res) => {
          if (res.status === 200) {
            setAllDataCategories(res.data.data)
          }
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }
    const getAllPackages = async () => {
      await instance.get('/packages/all').then((res) => {
        setPackages(res.data.data)
      })
    }
    const getStockItems = async () => {
      await instance
        .get('/stock/item/all')
        .then((res) => {
          setStockItems(res.data.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    }

    getAllCategories()
    getAllPackages()
    getStockItems()
  }, [])
  return (
    <React.Fragment>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <h2 className="text-center">
                <strong> Edit Product </strong>
              </h2>
            </CCardHeader>
            <CCardBody>
              <CForm
                className="row"
                name="roomClassAddFrm"
                encType="multipart/form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <CRow>
                  <p className="fs-6 lead fw-bolder  text-center">
                    Product details
                  </p>
                  <CCol md={6}>
                    <CFormLabel htmlFor="title"> Product title </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="title"
                      id="title"
                      defaultValue={selectedProduct.name}
                      required
                      {...register('name')}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="category">
                      {' '}
                      Product category{' '}
                    </CFormLabel>
                    <CFormSelect
                      name="category"
                      id="category"
                      className="mb-3"
                      aria-label="edit product category"
                      value={
                        allDataCategories.filter(
                          (cat) =>
                            cat.id === productPackages[0].ProductCategory.id,
                        )[0]
                      }
                      {...register('category')}
                    >
                      {allDataCategories && allDataCategories.length !== 0
                        ? allDataCategories.map((category) => (
                            <option
                              value={category.id}
                              key={category.id}
                              selected={
                                productPackages
                                  ? productPackages !== 0
                                    ? productPackages[0].ProductCategory
                                        .name === category.name
                                      ? true
                                      : false
                                    : false
                                  : false
                              }
                            >
                              {category.name}
                            </option>
                          ))
                        : null}
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow>
                  <p className="fs-6 lead fw-bolder  text-center">
                    Product packages
                  </p>
                  {selectedProduct &&
                  productPackages &&
                  productPackages.length !== 0
                    ? productPackages.map((el, i) => (
                        <CCol
                          key={i}
                          onMouseEnter={(e) => {
                            setStyle({ display: 'block' })
                          }}
                          onMouseLeave={(e) => {
                            setStyle({ display: 'none' })
                          }}
                        >
                          <p className="fw-bold text-capitalize">
                            {el.name} of {selectedProduct.name}
                          </p>
                          <p className="fst-italic fw-seminbold">
                            Price {el.ProductPackage.price} RWF
                          </p>
                          <p className="fw-light fst-italic">contains</p>
                          {el.ProductPackage.items &&
                          el.ProductPackage.items.length !== 0 ? (
                            el.ProductPackage.items.map((e, n) => (
                              <p className="" key={n}>
                                {e.quantity} {e.unit} of {e.itemName}
                              </p>
                            ))
                          ) : (
                            <p>no items listed</p>
                          )}

                          <div
                            className=" col-2 btn btn-warning btn-sm"
                            style={style}
                            onClick={() => {
                              setVisible(!visible)
                              dispatch(selectItem(el))
                            }}
                          >
                            Edit package
                          </div>
                          <PackageEditModal
                            visible={visible}
                            setVisible={setVisible}
                            productPackage={el}
                            packages={packages}
                            productPackages={selectedProduct.Packages}
                            setProductPackages={setProductPackages}
                            selectedProductPackages={selectedProduct.Packages}
                            stockItems={stockItems}
                          />
                        </CCol>
                      ))
                    : null}
                </CRow>

                <CCol xs={12} className="text-center my-3">
                  <CButton
                    component="input"
                    type="submit"
                    value=" Update product"
                  />
                </CCol>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </React.Fragment>
  )
}

export default ProductEdit
