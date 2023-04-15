import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormSelect,
  CCol,
  CFormInput,
  CForm,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { instance, getTokenPromise } from 'src/API/AxiosInstance'
import { currencies } from 'src/utils/constants'

function AddPaymentModal(props) {
  let { reservation, open, setOpen } = props
  const { register, handleSubmit } = useForm()
  const onSubmit = async (data) => {
    data.reservationId = reservation.id

    await instance
      .post('/reservation/pay', data)
      .then(() => {
        toast.success('payment added')
      })
      .then((err) => {
        toast.error(err.message)
      })
    // reset()
  }

  return (
    <>
      <CModal alignment="center" visible={open} onClose={() => setOpen(false)}>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <CModalHeader>
            <CModalTitle className="text-center">Add payment</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CCol>
              <CFormLabel htmlFor="paymentMethod">Payment</CFormLabel>
              <CFormInput
                name="payment"
                id="payment"
                type="text"
                size="md"
                className="mb-3"
                {...register('payment')}
              />
            </CCol>
            <CCol>
              <div className="col">
                <CFormLabel htmlFor="paymentMethod">Payment method</CFormLabel>
                <CFormSelect
                  name="paymentMethod"
                  id="paymentMethod"
                  size="md"
                  className="mb-3"
                  {...register('paymentMethod')}
                >
                  <option value="Cash">Cash</option>
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Credit card">Credit card</option>
                  <option value="Credit">Credit</option>
                  <option value="Cheque">Cheque</option>
                </CFormSelect>
              </div>
              <div className="col">
                <CFormLabel htmlFor="currency">Currency</CFormLabel>
                <CFormSelect
                  name="paymentMethod"
                  id="paymentMethod"
                  size="md"
                  className="mb-3"
                  defaultValue={'RWF'}
                  {...register('currency')}
                >
                  {Object.keys(currencies).map((curr, i) => (
                    <option value={curr} key={i + 1}>
                      {curr} :{currencies[curr]}{' '}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </CCol>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setOpen(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              Save changes
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default AddPaymentModal
