import React, { useState } from 'react'
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalHeader,
  CRow,
} from '@coreui/react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import PackageItems from '../ProductAdd/PackageItems'

const CreatePackageModal = (props) => {
  const { register, getValues, reset } = useForm()
  const {
    stockItems,
    packageItems,
    setPackageItems,
    category,
    productPackages,
    setProductPackages,
    visible,
    setVisible,
    packages,
    setPackages,
  } = props

  const [item, setItem] = useState([])
  const onAdd = (data) => {
    data = {
      ...data,
      itemId: item[0].id,
      itemName: item[0].name,
    }
    setPackageItems([...packageItems, data])
  }
  const addPackage = (data) => {
    data.id = data.packageId
    data.items = packageItems
    delete data.unit
    setProductPackages([...productPackages, data])
    setPackageItems([])
    reset()
  }

  return (
    <CModal
      alignment="center"
      visible={visible}
      onClose={() => setVisible(false)}
      size="lg"
    >
      <CModalHeader />
      <CForm className="m-3">
        <CRow>
          <p className="lead text-center my-2 fw-bolder"> Customize Package</p>

          <CRow>
            <p className="lead text-center my-2 "> Package details </p>
            <CCol>
              <CFormLabel htmlFor="package id">Package name</CFormLabel>
              <CFormSelect
                name="package id"
                id="packageId"
                size="md"
                className="mb-3"
                aria-label="package id"
                {...register('packageId', { required: true })}
              >
                {packages && packages.length !== 0
                  ? packages.map((pack, i) => (
                      <option key={i} value={pack.id}>
                        {pack.name}
                      </option>
                    ))
                  : null}
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <CFormLabel htmlFor="price"> Price in RWF</CFormLabel>
              <CFormInput
                type="number"
                name="price"
                id="price"
                placeholder="  RWF"
                size="md"
                required
                {...register('price')}
              />
            </CCol>
          </CRow>

          <CRow>
            <p className="lead text-center my-2 "> Package items </p>
            <CCol>
              <div className="d-flex justify-content-between">
                <CFormLabel htmlFor="name"> Item name </CFormLabel>
                {stockItems && stockItems.length === 0 ? (
                  <Link to="/stock/item/add" className="d-block">
                    Add item to list
                  </Link>
                ) : null}
              </div>
              <Typeahead
                id="basic-typeahead-single"
                filterBy={['name']}
                labelKey="name"
                onChange={setItem}
                options={stockItems}
                placeholder="item name ..."
                selected={item}
              />
            </CCol>
            <CCol>
              <CFormLabel htmlFor="quantity"> Quantity</CFormLabel>
              <CFormInput
                type="number"
                name="quantity"
                id="quantity"
                placeholder=" "
                size="md"
                step="any"
                min={0}
                required
                {...register('quantity')}
              />
            </CCol>
            <CCol>
              <CFormLabel htmlFor="unit"> Unit </CFormLabel>
              <CFormSelect
                name="unit"
                id="unit"
                size="md"
                className="mb-3"
                aria-label="item quantity unit"
                {...register('unit', { required: true })}
              >
                <option value="Kg"> Kg </option>
                <option value="l"> ltr </option>
                <option value="piece"> piece </option>
              </CFormSelect>
            </CCol>
            <CCol xs={12} className="d-flex justify-content-center my-3">
              <CButton
                component="input"
                value="Add item"
                className="my-2 text-white"
                style={{ backgroundColor: 'black' }}
                onClick={() => {
                  const data = getValues()
                  console.log('this is on add data', data)
                  return onAdd(data)
                }}
              />
            </CCol>
          </CRow>
        </CRow>

        <CRow>
          <div>
            {' '}
            <PackageItems
              requestItems={packageItems}
              setRequestItems={setPackageItems}
            />
          </div>
        </CRow>
        <CCol xs={12} className="d-flex justify-content-center my-3">
          <CButton
            component="input"
            value="Add Package"
            className="my-2"
            onClick={() => {
              let data = getValues()

              return addPackage(data)
            }}
          />
        </CCol>
      </CForm>
    </CModal>
  )
}

const Step2 = (props) => {
  let {
    register,
    getValues,
    stockItems,
    packageItems,
    setPackageItems,
    category,
    productPackages,
    setProductPackages,
    packages,
    setPackages,
  } = props
  const [visible, setVisible] = useState(false)
  const data = getValues()

  packages =
    packages && data && data.category
      ? packages.filter(
          (pack) => pack.ProductCategory.id === Number(data.category),
        )
      : packages

  return (
    <div>
      <p className="fw-bolder lead text-center">Product packages</p>
      <div className="text-center">
        <CButton onClick={() => setVisible(!visible)}>Create package</CButton>
        <CreatePackageModal
          visible={visible}
          setVisible={setVisible}
          register={register}
          getValues={getValues}
          stockItems={stockItems}
          packageItems={packageItems}
          setPackageItems={setPackageItems}
          category={category}
          packages={packages}
          productPackages={productPackages}
          setProductPackages={setProductPackages}
        />
      </div>
      <div>
        <p className="lead fw-bolder"> Product packages</p>
        {productPackages && productPackages.length !== 0 ? (
          <div className="col d-flex gap-3 flex-wrap">
            {productPackages.map((pack, i) => (
              <div className="">
                <p className="fw-bold"> Package {i + 1}</p>
                <p>
                  Name :
                  {
                    packages.filter(
                      (item) => item.id === Number(pack.packageId),
                    )[0].name
                  }
                </p>
                <p> Price : {pack.price}</p>
                <div>
                  <p className="fw-bold">Items</p>
                  {pack.items && pack.items.length !== 0
                    ? pack.items.map((e) => (
                        <div>
                          <p>Name : {e.itemName}</p>
                          <p>
                            Quantity : {e.quantity} {e.unit}
                          </p>
                        </div>
                      ))
                    : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No packages set for product</div>
        )}
      </div>
    </div>
  )
}

export default Step2
