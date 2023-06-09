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
import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import PackageItems from './ProductAdd/PackageItems'

const PackageEditModal = (props) => {
  const { register, getValues, reset } = useForm()
  let {
    packages,
    visible,
    setVisible,
    productPackage,
    setProductPackages,
    productPackages,
    selectedProductPackages,
    stockItems,
  } = props

  const [packageItems, setPackageItems] = useState(
    productPackage.ProductPackage.items,
  )
  const [item, setItem] = useState([])
  const onAdd = (data) => {
    data = {
      ...data,
      stockItemId: item[0].id,
      itemName: item[0].name,
    }
    setPackageItems([...packageItems, data])
  }
  const addPackage = (data) => {
    data.id = data.packageId
    data.items = packageItems
    console.log('sawa', data)
    selectedProductPackages = selectedProductPackages.filter((pac) =>
      pac.id == data.id ? { ...pac, ...data } : pac,
    )

    setProductPackages(selectedProductPackages)
    //   delete data.unit
    //   setProductPackages([...productPackages, data])
    //   setPackageItems([])
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
                className="mb-3"
                aria-label="package id"
                {...register('packageId', { required: true })}
              >
                {packages && packages.length !== 0
                  ? packages.map((pack, i) => {
                      return (
                        <option
                          key={i}
                          value={productPackage.id}
                          selected={
                            productPackage.id === pack.id ? true : false
                          }
                        >
                          {pack.name}
                        </option>
                      )
                    })
                  : null}
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <CFormLabel htmlFor="price"> Price in RWF</CFormLabel>
              <CFormInput
                type="number"
                min={0}
                name="price"
                id="price"
                defaultValue={productPackage.ProductPackage.price}
                placeholder="  RWF"
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
            value="Edit Package"
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
export default PackageEditModal
