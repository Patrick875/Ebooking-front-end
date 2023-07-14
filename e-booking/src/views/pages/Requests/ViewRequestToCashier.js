import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'
import PurchaseOrderFooter from '../Printing/PurchaseOrderFooter'
import BackButton from 'src/components/Navigating/BackButton'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

const ViewRequestToCashier = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const [approved, setApproved] = useState(false)
  const request = useSelector((state) => state.selection.selected)
  const readOnly = request && request.status === 'APPROVED' ? true : false
  let StockPurchaseOrderDetails
  if (request && request.StockPurchaseOrderDetails) {
    StockPurchaseOrderDetails = request.StockPurchaseOrderDetails
  }
  let [rows, setRows] = useState([...StockPurchaseOrderDetails])
  const approvePurchaseOrder = async () => {
    await instance
      .post('/purchase/order/approve', { orderId: request.id, data: [...rows] })
      .then((res) => {
        toast.success('purchase order approved !!')
        setApproved(!approved)
      })
      .catch(() => {
        toast.error('purchase order approval failed !!!')
      })
  }
  const orderTotal =
    rows && rows !== 0
      ? rows
          .reduce(
            (acc, b) => acc + Number(b.requestQuantity) * Number(b.unitPrice),
            0,
          )
          .toLocaleString()
      : 0

  const onChangeInput = (e, id) => {
    const { name, value } = e.target

    const editData = rows.map((item) =>
      item.id === id && name
        ? name === 'name'
          ? {
              ...item,
              StockItemNew: {
                ...item.StockItemValue.StockItemNew,
                name: value,
              },
            }
          : { ...item, [name]: value }
        : item,
    )

    setRows(editData)
  }

  return (
    <div className="mx-0 px-0">
      <div className="d-flex justify-content-between">
        <BackButton />
        <div className="col-md-8 d-flex justify-content-end">
          {StockPurchaseOrderDetails && StockPurchaseOrderDetails !== 0 ? (
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          ) : null}
          <button
            className="btn btn-ghost-success text-black"
            onClick={approvePurchaseOrder}
            disabled={request.status === 'APPROVED' || approved}
          >
            Approve
          </button>

          <button
            className="btn btn-ghost-danger text-black"
            disabled={request.status === 'APPROVED' || approved}
          >
            Cancel
          </button>
        </div>
      </div>
      <PrintTemplate1 ref={ref || componentRef}>
        <div className="mx-0 my-0  py-0 px-0 ">
          <h6 className="text-center my-1 text-uppercase">
            Purchase order &#8470; {request.purchaseOrderId}
          </h6>
          <div className="editableTable">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>unit</th>
                  <th>Quantity</th>
                  <th>U.P</th>
                  <th>T.P</th>
                </tr>
              </thead>
              <tbody>
                {[...rows].map(
                  ({ id, unit, unitPrice, StockItemNew, requestQuantity }) => (
                    <tr key={id}>
                      <td style={{ minWidth: '212px' }}>
                        <input
                          name="name"
                          value={StockItemNew.name}
                          readOnly={readOnly}
                          type="text"
                          onChange={(e) => onChangeInput(e, id)}
                          placeholder=""
                        />
                      </td>
                      <td>
                        <input
                          name="unit"
                          value={unit}
                          readOnly={readOnly}
                          type="text"
                          onChange={(e) => onChangeInput(e, id)}
                          placeholder=""
                        />
                      </td>
                      <td>
                        <input
                          name="requestQuantity"
                          value={requestQuantity === 0 ? '' : requestQuantity}
                          readOnly={readOnly}
                          type="text"
                          onChange={(e) => onChangeInput(e, id)}
                          placeholder=""
                        />
                      </td>
                      <td>
                        <input
                          name={'unitPrice'}
                          type="text"
                          value={unitPrice === 0 ? ' ' : unitPrice}
                          readOnly={readOnly}
                          onChange={(e) => onChangeInput(e, id)}
                          placeholder=""
                        />
                      </td>
                      <td>
                        <input
                          name="total"
                          type="text"
                          value={
                            Number(unitPrice * requestQuantity) === 0
                              ? ''
                              : Number(unitPrice * requestQuantity)
                          }
                          onChange={(e) => onChangeInput(e, id)}
                          readOnly={readOnly}
                          placeholder=""
                        />
                      </td>
                    </tr>
                  ),
                )}
                <tr key={1000} className="lastRows">
                  <td className="px-2 fw-bold">Total</td>
                  <td className="px-2" />
                  <td className="px-2" />
                  <td className="px-2" />
                  <td className="text-end px-2 fw-bold">{orderTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <PurchaseOrderFooter />
      </PrintTemplate1>
    </div>
  )
})

export default ViewRequestToCashier
