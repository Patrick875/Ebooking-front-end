import {
  CButton,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { instance } from 'src/API/AxiosInstance'

function SellsConfirmModel(props) {
  const { selectedItem, visible, setVisible, confirmSell } = props
  const { register, watch } = useForm()
  const momo = watch('momo') || 0
  const pos = watch('pos') || 0
  const cash = watch('cash') || 0
  const sum = Number(cash) + Number(momo) + Number(pos)

  return (
    <CModal
      visible={visible}
      onClose={() => {
        setVisible(!visible)
      }}
    >
      <CModalHeader>Amount Received</CModalHeader>
      <CModalBody className="col">
        <div className="row d-flex">
          <div className="col">
            <CFormLabel>CASH</CFormLabel>
            <CFormInput
              {...register('cash')}
              id="CASH"
              type="number"
              step="any"
              placeholder="CASH"
            />
          </div>
          <div className="col">
            <CFormLabel>MOMO</CFormLabel>
            <CFormInput
              {...register('momo')}
              id="MOMO"
              type="number"
              step="any"
              placeholder="MOMO"
            />
          </div>
          <div className="col">
            <CFormLabel>POS</CFormLabel>
            <CFormInput
              {...register('pos')}
              id="POS"
              type="number"
              step="any"
              placeholder="POS"
            />
          </div>
        </div>
        <div>
          <p>
            Amount due :{' '}
            {selectedItem ? Number(selectedItem.amount).toLocaleString() : ' '}{' '}
            RWF
          </p>
          <p>Total: {Number(sum).toLocaleString()} RWF</p>
        </div>
        {selectedItem && sum > selectedItem.amount ? (
          <p className="text-danger">
            Excess : {Number(sum - selectedItem.amount).toLocaleString()} RWF{' '}
          </p>
        ) : null}
        {selectedItem && sum < selectedItem.amount ? (
          <p style={{ color: 'magenta', fontWeight: 'bold' }}>
            Loss : {Number(sum - selectedItem.amount).toLocaleString()} RWF{' '}
          </p>
        ) : null}
      </CModalBody>
      <CModalFooter>
        <CButton
          onClick={() => {
            confirmSell({
              id: selectedItem.id,
              paymentMethod: { CASH: cash, MOMO: momo, POS: pos },
            })
            setVisible(false)
          }}
        >
          Confirm
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

function SellsPending() {
  const [sells, setSells] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  let pendingSells =
    sells && sells.length !== 0
      ? sells.filter((sell) => sell.status === 'PENDING')
      : null
  useEffect(() => {
    const getProductSells = async () => {
      await instance
        .get('/products/package/sells')
        .then((res) => {
          setSells(res.data.data)
          console.log('sells', res.data.data)
        })
        .catch((err) => {
          console.log(err.message)
        })
    }

    getProductSells()
  }, [])

  const confirmSell = async (data) => {
    await instance
      .post('/products/package/sells/approve', data)
      .then(() => {
        toast.success('order confirmed')
        const updatedData = sells.filter((item) => item.id !== data.id)
        setSells(updatedData)
      })
      .catch(() => {
        console.log('order confirm failed')
      })
  }
  const cancelSell = async (data) => {
    await instance
      .post('/products/package/sells/cancel', data)
      .then(() => {
        toast.success('order concel success')
        const updatedData = sells.filter((item) => !item)
        setSells(updatedData)
      })
      .catch(() => {
        console.log('order cancel failed')
      })
  }

  return (
    <div>
      <CCardHeader>
        <h2>
          <strong> Sells pending </strong>
        </h2>
      </CCardHeader>
      <CCardBody>
        <CTable bordered>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Account</CTableHeaderCell>
              <CTableHeaderCell scope="col">Done by</CTableHeaderCell>
              <CTableHeaderCell scope="col">Product</CTableHeaderCell>
              <CTableHeaderCell scope="col">Price</CTableHeaderCell>
              <CTableHeaderCell scope="col">Qty</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              <CTableHeaderCell scope="col">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {pendingSells && pendingSells.length !== 0
              ? pendingSells.map((item, i) => {
                  return (
                    <CTableRow key={item.id}>
                      <CTableHeaderCell scope="row">{i + 1}</CTableHeaderCell>
                      <CTableDataCell>{`${item.petitStock.name}`}</CTableDataCell>
                      <CTableDataCell>{`${item.user.firstName}  ${item.user.lastName} `}</CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {item.petitStockSaleDetails.map((el, i) => (
                            <p key={el + i}>
                              {' '}
                              {el.quantity}{' '}
                              {el.quantity > 1
                                ? `${el.Package.name}s`
                                : el.Package.name}{' '}
                              of {el.Package.Products.name}{' '}
                            </p>
                          ))}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {item.petitStockSaleDetails.map((el, i) => (
                            <p key={el + i}>
                              {el.Package.Products.ProductPackage.price}
                            </p>
                          ))}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          {item.petitStockSaleDetails.map((el, i) => (
                            <p key={el + i}>{el.quantity}</p>
                          ))}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>{`${item.amount}`}</CTableDataCell>
                      <CTableDataCell className="d-flex gap-3">
                        <div
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setSelectedItem(item)
                            setVisible(true)
                          }}
                        >
                          Confirm
                        </div>
                        <div className="btn btn-danger btn-sm">Cancel</div>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })
              : null}
          </CTableBody>
        </CTable>
      </CCardBody>
      <SellsConfirmModel
        selectedItem={selectedItem}
        visible={visible}
        setVisible={setVisible}
        confirmSell={confirmSell}
      />
    </div>
  )
}

export default SellsPending
