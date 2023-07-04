import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintTemplate1 from '../Printing/PrintTemplate1'
import PurchaseOrderFooter from '../Printing/PurchaseOrderFooter'
import BackButton from 'src/components/Navigating/BackButton'

const ViewRequestToCashier = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  const request = useSelector((state) => state.selection.selected)
  let StockPurchaseOrderDetails
  if (request && request.StockPurchaseOrderDetails) {
    StockPurchaseOrderDetails = request.StockPurchaseOrderDetails
  }
  const [rows, setRows] = useState([...StockPurchaseOrderDetails])

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
    <div>
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
        </div>
      </div>

      <PrintTemplate1 ref={ref || componentRef}>
        <div className="m-3 p-3">
          <p className="fw-bold text-center text-uppercase my-1">
            Purchase order &#8470; {request.purchaseOrderId}
          </p>

          <div className="d-flex justify-content-around">
            <div>
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
                      ({
                        id,
                        unit,
                        unitPrice,
                        StockItemNew,
                        requestQuantity,
                      }) => (
                        <tr key={id}>
                          <td>
                            <input
                              name="name"
                              value={StockItemNew.name}
                              readOnly={true}
                              type="text"
                              onChange={(e) => onChangeInput(e, id)}
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              name="unit"
                              value={unit}
                              readOnly={true}
                              type="text"
                              onChange={(e) => onChangeInput(e, id)}
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              name="requestQuantity"
                              value={
                                requestQuantity === 0 ? '' : requestQuantity
                              }
                              readOnly={true}
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
                              readOnly={true}
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
                              readOnly={true}
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
          </div>
        </div>
        <PurchaseOrderFooter />
      </PrintTemplate1>
    </div>
  )
})

export default ViewRequestToCashier
