import { toast } from 'react-hot-toast'
const {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
} = require('@coreui/react')

const { instance } = require('src/API/AxiosInstance')

const DeleteItemModel = (props) => {
  const { visible, setVisible, item, itemId, itemType, setDeleted } = props
  const deleteInvoice = async (id) => {
    await instance.post('/invoices/delete', { id }).then((res) => {
      toast.success(`${itemType} deleted successfuly`)
      setDeleted(res.data.data.id)
    })
  }
  const deleteProFormaInvoice = async (id) => {
    await instance
      .post('/proforma/delete', { id })
      .then((res) => {
        toast.success(`${itemType} deleted successfuly`)
        setDeleted(res.data.data.id)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
  const deleteDeliveryNote = async (id) => {
    console.log('id', id)
    await instance
      .post('/deliveryNote/delete', { id })
      .then((res) => {
        console.log('res', res)
        setDeleted(res.data.data.id)

        toast.success(`${itemType} deleted successfuly`)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
  const deletePurchaseOrder = async (id) => {
    await instance
      .post('/accounting/purchase/order/delete', { id })
      .then((res) => {
        console.log('res', res)
        setDeleted(res.data.data.id)
        toast.success(`${itemType} deleted successfuly`)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
  const deleteItem = async (itemId) => {
    if (itemType === 'invoice') {
      await deleteInvoice(itemId)
    } else if (itemType === 'proforma') {
      await deleteProFormaInvoice(itemId)
    } else if (itemType === 'delivery') {
      await deleteDeliveryNote(itemId)
    } else {
      await deletePurchaseOrder(itemId)
    }
    setVisible(false)
  }
  return (
    <CModal visible={visible}>
      <CModalHeader>Confirm {item} delete</CModalHeader>
      <CModalBody>
        <p>Are you sure you want to delete this {itemType}</p>
      </CModalBody>
      <CModalFooter>
        <CButton className="btn-secondary" onClick={() => setVisible(false)}>
          Cancel
        </CButton>
        <CButton
          className="btn-danger"
          onClick={() => {
            return deleteItem(itemId)
          }}
        >
          Delete {itemType}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}
export default DeleteItemModel
