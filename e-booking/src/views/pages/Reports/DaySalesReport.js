import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCardText,
  CCardTitle,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
} from '@coreui/react'
import React from 'react'
import { useForm } from 'react-hook-form'

function DaySalesReport() {
  const { register, handleSubmit, watch, reset } = useForm()
  const type = watch('type') || []
  const item1 = watch('item1') || []
  const swimmingPoolRevenue = watch('swimmingPoolRevenue') || []
  const saunaMassageRevenue = watch('saunaMassageRevenue') || []
  const receiptionItems = watch('receiptionItems') || []

  return (
    <div>
      <CForm>
        <CCard>
          <CCardHeader>Particular 1</CCardHeader>
          <CCardBody>
            <CCardTitle>MAIN BAR Sales</CCardTitle>
            <CFormLabel>Food and Beverage</CFormLabel>
            <div>
              <div className="d-flex flex-col">
                <div className="col">
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="RWF cash transactions "
                      value="cash_rwf"
                      {...register('type')}
                    />
                    <CFormLabel>Cash(RWF)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="cash_usd"
                      {...register('type')}
                    />
                    <CFormLabel>Cash(USD)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="MOMO transactions "
                      value="cash_momo"
                      {...register('type')}
                    />
                    <CFormLabel>MOMO</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="RWF Visa transactions "
                      value="rwfVisa"
                      {...register('type')}
                    />
                    <CFormLabel>RWF Visa</CFormLabel>
                  </div>
                </div>

                <div className="col">
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions"
                      value="usdVisa"
                      {...register('type')}
                    />
                    <CFormLabel>USD Visa</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="credit"
                      {...register('type')}
                    />
                    <CFormLabel>Credit (RWF)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="cheque"
                      {...register('type')}
                    />
                    <CFormLabel>Cheque(RWF)</CFormLabel>
                  </div>
                </div>
              </div>

              <CRow md="auto">
                {type && type.length !== 0 && type.includes('cash_rwf') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in RWF (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_rwf"
                      size="md"
                      {...register('transcation.cash_rwf')}
                      placeholder="...main bar sales "
                    />
                  </CCol>
                ) : null}
                {type && type.length !== 0 && type.includes('cash_usd') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_usd"
                      size="md"
                      {...register('transcation.cash_usd')}
                      placeholder="...main bar sales "
                    />
                  </CCol>
                ) : null}
                {type && type.length !== 0 && type.includes('cash_momo') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount on MoMo </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_momo"
                      size="md"
                      {...register('transcation.momo')}
                      placeholder="...main bar sales "
                    />
                  </CCol>
                ) : null}
                {type && type.length !== 0 && type.includes('rwfVisa') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in RWF (Visa) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="rwfVisa"
                      size="md"
                      {...register('transcation.cash_rwfVisa')}
                      placeholder="...main bar sales "
                    />
                  </CCol>
                ) : null}
                {type && type.length !== 0 && type.includes('usdVisa') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Visa) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="usdVisa"
                      size="md"
                      {...register('transcation.cash_usdVisa')}
                      placeholder="...main bar sales "
                    />
                  </CCol>
                ) : null}
                {type && type.length !== 0 && type.includes('credit') ? (
                  <CCol md={4}>
                    <CFormLabel>Credit in RWF </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="credit"
                      size="md"
                      {...register('transcation.credit')}
                      placeholder="...main bar sales "
                    />
                  </CCol>
                ) : null}
                {type && type.length !== 0 && type.includes('cheque') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cheque"
                      size="md"
                      {...register('transcation.cheque')}
                      placeholder="...main bar sales "
                    />
                  </CCol>
                ) : null}
              </CRow>
            </div>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>Particular 2</CCardHeader>
          <CCardBody>
            <CCardTitle>Accomodation sales</CCardTitle>
            <div className="">
              <CFormLabel>Name</CFormLabel>
              <CFormInput
                className="mb-1"
                type="text"
                name="name"
                id="accomodation item 1"
                size="md"
                {...register('accomodation.item1.name')}
                placeholder="...Room xxx,Room xxx final payment "
              />

              <div className="d-flex flex-col">
                <div className="col">
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="RWF cash transactions "
                      value="cash_rwf"
                      {...register('item1')}
                    />
                    <CFormLabel>Cash(RWF)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="cash_usd"
                      {...register('item1')}
                    />
                    <CFormLabel>Cash(USD)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="MOMO transactions "
                      value="cash_momo"
                      {...register('item1')}
                    />
                    <CFormLabel>MOMO</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="RWF Visa transactions "
                      value="rwfVisa"
                      {...register('item1')}
                    />
                    <CFormLabel>RWF Visa</CFormLabel>
                  </div>
                </div>

                <div className="col">
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions"
                      value="usdVisa"
                      {...register('item1')}
                    />
                    <CFormLabel>USD Visa</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="credit"
                      {...register('item1')}
                    />
                    <CFormLabel>Credit (RWF)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="cheque"
                      {...register('item1')}
                    />
                    <CFormLabel>Cheque(RWF)</CFormLabel>
                  </div>
                </div>
              </div>
              <CRow md="auto">
                {item1 && item1.length !== 0 && item1.includes('cash_rwf') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in RWF (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_rwf"
                      size="md"
                      {...register('transcation.cash_rwf')}
                      placeholder="...accomodation sale amount "
                    />
                  </CCol>
                ) : null}
                {item1 && item1.length !== 0 && item1.includes('cash_usd') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_usd"
                      size="md"
                      {...register('transcation.cash_usd')}
                      placeholder="...accomodation sale amount "
                    />
                  </CCol>
                ) : null}
                {item1 && item1.length !== 0 && item1.includes('cash_momo') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount on MoMo </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_momo"
                      size="md"
                      {...register('transcation.momo')}
                      placeholder="...accomodation sale amount "
                    />
                  </CCol>
                ) : null}
                {item1 && item1.length !== 0 && item1.includes('rwfVisa') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in RWF (Visa) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="rwfVisa"
                      size="md"
                      {...register('transcation.cash_rwfVisa')}
                      placeholder="...accomodation sale amount "
                    />
                  </CCol>
                ) : null}
                {item1 && item1.length !== 0 && item1.includes('usdVisa') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Visa) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="usdVisa"
                      size="md"
                      {...register('transcation.cash_usdVisa')}
                      placeholder="...accomodation sale amount "
                    />
                  </CCol>
                ) : null}
                {item1 && item1.length !== 0 && item1.includes('credit') ? (
                  <CCol md={4}>
                    <CFormLabel>Credit in RWF </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="credit"
                      size="md"
                      {...register('transcation.credit')}
                      placeholder="...accomodation sale amount "
                    />
                  </CCol>
                ) : null}
                {item1 && item1.length !== 0 && item1.includes('cheque') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cheque"
                      size="md"
                      {...register('transcation.cheque')}
                      placeholder="...accomodation sale amount "
                    />
                  </CCol>
                ) : null}
              </CRow>
            </div>

            <CButton className=" col btn-Primary text-center my-2">
              {' '}
              Add Item
            </CButton>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>Particular 3</CCardHeader>
          <CCardBody>
            <CCardTitle>Health Club sales</CCardTitle>
            <div className="">
              <CFormLabel>SWIMMING POOL SALES</CFormLabel>
              <div className="d-flex flex-col">
                <div className="col">
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="RWF cash transactions "
                      value="cash_rwf"
                      {...register('swimmingPoolRevenue')}
                    />
                    <CFormLabel>Cash(RWF)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="cash_usd"
                      {...register('swimmingPoolRevenue')}
                    />
                    <CFormLabel>Cash(USD)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="MOMO transactions "
                      value="cash_momo"
                      {...register('swimmingPoolRevenue')}
                    />
                    <CFormLabel>MOMO</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="RWF Visa transactions "
                      value="rwfVisa"
                      {...register('swimmingPoolRevenue')}
                    />
                    <CFormLabel>RWF Visa</CFormLabel>
                  </div>
                </div>

                <div className="col">
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions"
                      value="usdVisa"
                      {...register('swimmingPoolRevenue')}
                    />
                    <CFormLabel>USD Visa</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="credit"
                      {...register('swimmingPoolRevenue')}
                    />
                    <CFormLabel>Credit (RWF)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="cheque"
                      {...register('swimmingPoolRevenue')}
                    />
                    <CFormLabel>Cheque(RWF)</CFormLabel>
                  </div>
                </div>
              </div>
              <CRow md="auto">
                {swimmingPoolRevenue &&
                swimmingPoolRevenue.length !== 0 &&
                swimmingPoolRevenue.includes('cash_rwf') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in RWF (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_rwf"
                      size="md"
                      {...register('swimmingPool.cash_rwf')}
                      placeholder="...amount "
                    />
                  </CCol>
                ) : null}
                {swimmingPoolRevenue &&
                swimmingPoolRevenue.length !== 0 &&
                swimmingPoolRevenue.includes('cash_usd') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_usd"
                      size="md"
                      {...register('swimmingPool.cash_usd')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {swimmingPoolRevenue &&
                swimmingPoolRevenue.length !== 0 &&
                swimmingPoolRevenue.includes('cash_momo') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount on MoMo </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_momo"
                      size="md"
                      {...register('swimmingPool.momo')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {swimmingPoolRevenue &&
                swimmingPoolRevenue.length !== 0 &&
                swimmingPoolRevenue.includes('rwfVisa') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in RWF (Visa) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="rwfVisa"
                      size="md"
                      {...register('swimmingPool.cash_rwfVisa')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {swimmingPoolRevenue &&
                swimmingPoolRevenue.length !== 0 &&
                swimmingPoolRevenue.includes('usdVisa') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Visa) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="usdVisa"
                      size="md"
                      {...register('swimmingPool.cash_usdVisa')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {swimmingPoolRevenue &&
                swimmingPoolRevenue.length !== 0 &&
                swimmingPoolRevenue.includes('credit') ? (
                  <CCol md={4}>
                    <CFormLabel>Credit in RWF </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="credit"
                      size="md"
                      {...register('swimmingPool.credit')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {swimmingPoolRevenue &&
                swimmingPoolRevenue.length !== 0 &&
                swimmingPoolRevenue.includes('cheque') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cheque"
                      size="md"
                      {...register('swimmingPool.cheque')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
              </CRow>
              <CFormLabel>SAUNA AND MASSAGE SALES</CFormLabel>
              <div className="d-flex flex-col">
                <div className="col">
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="RWF cash transactions "
                      value="cash_rwf"
                      {...register('saunaMassageRevenue')}
                    />
                    <CFormLabel>Cash(RWF)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="cash_usd"
                      {...register('saunaMassageRevenue')}
                    />
                    <CFormLabel>Cash(USD)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="MOMO transactions "
                      value="cash_momo"
                      {...register('saunaMassageRevenue')}
                    />
                    <CFormLabel>MOMO</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="RWF Visa transactions "
                      value="rwfVisa"
                      {...register('saunaMassageRevenue')}
                    />
                    <CFormLabel>RWF Visa</CFormLabel>
                  </div>
                </div>

                <div className="col">
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions"
                      value="usdVisa"
                      {...register('saunaMassageRevenue')}
                    />
                    <CFormLabel>USD Visa</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="credit"
                      {...register('saunaMassageRevenue')}
                    />
                    <CFormLabel>Credit (RWF)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="cheque"
                      {...register('saunaMassageRevenue')}
                    />
                    <CFormLabel>Cheque(RWF)</CFormLabel>
                  </div>
                </div>
              </div>
              <CRow md="auto">
                {saunaMassageRevenue &&
                saunaMassageRevenue.length !== 0 &&
                saunaMassageRevenue.includes('cash_rwf') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in RWF (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_rwf"
                      size="md"
                      {...register('saunaMassage.cash_rwf')}
                      placeholder="...amount "
                    />
                  </CCol>
                ) : null}
                {saunaMassageRevenue &&
                saunaMassageRevenue.length !== 0 &&
                saunaMassageRevenue.includes('cash_usd') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_usd"
                      size="md"
                      {...register('saunaMassage.cash_usd')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {saunaMassageRevenue &&
                saunaMassageRevenue.length !== 0 &&
                saunaMassageRevenue.includes('cash_momo') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount on MoMo </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_momo"
                      size="md"
                      {...register('saunaMassage.momo')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {saunaMassageRevenue &&
                saunaMassageRevenue.length !== 0 &&
                saunaMassageRevenue.includes('rwfVisa') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in RWF (Visa) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="rwfVisa"
                      size="md"
                      {...register('saunaMassage.cash_rwfVisa')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {saunaMassageRevenue &&
                saunaMassageRevenue.length !== 0 &&
                saunaMassageRevenue.includes('usdVisa') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Visa) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="usdVisa"
                      size="md"
                      {...register('saunaMassage.cash_usdVisa')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {saunaMassageRevenue &&
                saunaMassageRevenue.length !== 0 &&
                saunaMassageRevenue.includes('credit') ? (
                  <CCol md={4}>
                    <CFormLabel>Credit in RWF </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="credit"
                      size="md"
                      {...register('saunaMassage.credit')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {saunaMassageRevenue &&
                saunaMassageRevenue.length !== 0 &&
                saunaMassageRevenue.includes('cheque') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cheque"
                      size="md"
                      {...register('saunaMassage.cheque')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
              </CRow>
            </div>
          </CCardBody>
        </CCard>
        <CCard>
          <CCardHeader>Particular 4</CCardHeader>
          <CCardBody>
            <CCardTitle>Receiption sales</CCardTitle>
            <div className="">
              <CFormLabel>Name</CFormLabel>
              <CFormInput
                className="mb-1"
                type="text"
                name="name"
                id="accomodation item 1"
                size="md"
                {...register('receiption.item1.name')}
                placeholder="..."
              />

              <div className="d-flex flex-col">
                <div className="col">
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="RWF cash transactions "
                      value="cash_rwf"
                      {...register('receiptionItems')}
                    />
                    <CFormLabel>Cash(RWF)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="cash_usd"
                      {...register('receiptionItems')}
                    />
                    <CFormLabel>Cash(USD)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="MOMO transactions "
                      value="cash_momo"
                      {...register('receiptionItems')}
                    />
                    <CFormLabel>MOMO</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="RWF Visa transactions "
                      value="rwfVisa"
                      {...register('receiptionItems')}
                    />
                    <CFormLabel>RWF Visa</CFormLabel>
                  </div>
                </div>

                <div className="col">
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions"
                      value="usdVisa"
                      {...register('receiptionItems')}
                    />
                    <CFormLabel>USD Visa</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="credit"
                      {...register('receiptionItems')}
                    />
                    <CFormLabel>Credit (RWF)</CFormLabel>
                  </div>
                  <div className=" col d-flex gap-2 ">
                    <CFormCheck
                      className=""
                      id="USD cash transactions "
                      value="cheque"
                      {...register('receiptionItems')}
                    />
                    <CFormLabel>Cheque(RWF)</CFormLabel>
                  </div>
                </div>
              </div>
              <CRow md="auto">
                {receiptionItems &&
                receiptionItems.length !== 0 &&
                receiptionItems.includes('cash_rwf') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in RWF (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_rwf"
                      size="md"
                      {...register('receiption.cash_rwf')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {receiptionItems &&
                receiptionItems.length !== 0 &&
                receiptionItems.includes('cash_usd') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_usd"
                      size="md"
                      {...register('receiption.cash_usd')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {receiptionItems &&
                receiptionItems.length !== 0 &&
                receiptionItems.includes('cash_momo') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount on MoMo </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cash_momo"
                      size="md"
                      {...register('receiption.momo')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {receiptionItems &&
                receiptionItems.length !== 0 &&
                receiptionItems.includes('rwfVisa') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in RWF (Visa) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="rwfVisa"
                      size="md"
                      {...register('receiption.cash_rwfVisa')}
                      placeholder="...amount "
                    />
                  </CCol>
                ) : null}
                {receiptionItems &&
                receiptionItems.length !== 0 &&
                receiptionItems.includes('usdVisa') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Visa) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="usdVisa"
                      size="md"
                      {...register('receiption.cash_usdVisa')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {receiptionItems &&
                receiptionItems.length !== 0 &&
                receiptionItems.includes('credit') ? (
                  <CCol md={4}>
                    <CFormLabel>Credit in RWF </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="credit"
                      size="md"
                      {...register('receiption.credit')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
                {receiptionItems &&
                receiptionItems.length !== 0 &&
                receiptionItems.includes('cheque') ? (
                  <CCol md={4}>
                    <CFormLabel>Amount in USD (Cash) </CFormLabel>
                    <CFormInput
                      className="mb-1"
                      type="text"
                      name="mainBar"
                      id="cheque"
                      size="md"
                      {...register('receiption.cheque')}
                      placeholder="... amount "
                    />
                  </CCol>
                ) : null}
              </CRow>
            </div>

            <CButton className=" col btn-Primary text-center my-2">
              {' '}
              Add Item
            </CButton>
          </CCardBody>
        </CCard>
      </CForm>
    </div>
  )
}

export default DaySalesReport
