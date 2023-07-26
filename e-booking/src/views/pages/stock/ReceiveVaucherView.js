import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintHeader from '../Printing/PrintHeader'
import PrintFooterSignatures from '../Printing/PrintFooterSignatures'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import BackButton from 'src/components/Navigating/BackButton'

const ReceiveVaucherView = React.forwardRef((props, ref) => {
  const vaucher = useSelector((state) => state.selection.selected)
  const componentRef = useRef()
  let [rowsPurchase] = useState(
    vaucher.StockPurchaseOrder.StockPurchaseOrderDetails,
  )
  let [rowsReceive, setRowsReceive] = useState(
    vaucher.StockReceiveVoucherDetails,
  )
  const receiveTotal =
    vaucher && vaucher.StockReceiveVoucherDetails !== 0
      ? vaucher.StockReceiveVoucherDetails.reduce(
          (acc, b) => acc + Number(b.receivedQuantity) * Number(b.unitPrice),
          0,
        )
      : 0

  const purchaseTotal =
    vaucher &&
    vaucher.StockPurchaseOrder &&
    vaucher.StockPurchaseOrder.StockPurchaseOrderDetails !== 0
      ? vaucher.StockPurchaseOrder['StockPurchaseOrderDetails'].reduce(
          (acc, b) => acc + Number(b.requestQuantity) * Number(b.unitPrice),
          0,
        )
      : 0
  const Balance = purchaseTotal - receiveTotal

  const onChangeInput = (e, id) => {
    const { name, value } = e.target
    const editData = rowsReceive.map((item) =>
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

    setRowsReceive(editData)
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-ghost-primary">Print</button>
          )}
          content={() => ref || componentRef.current}
        />
      </div>

      <div ref={ref || componentRef}>
        <PrintHeader />
        <div className="m-3 p-3">
          <p className="text-center text-uppercase my-1 fw-bold">
            Receive stock vaucher of{' '}
            {vaucher && vaucher.date
              ? new Date(vaucher.date).toLocaleDateString('fr-FR')
              : null}
          </p>

          <div className="d-flex justify-content-around">
            <div className="editableTable">
              <table>
                <thead>
                  <tr>
                    <th>Item name</th>
                    <th>unit</th>
                    <th>Qty</th>
                    <th>U.P</th>
                    <th>T.P</th>
                  </tr>
                </thead>
                <tbody>
                  {[...rowsPurchase].map(
                    ({
                      id,
                      unit,
                      unitPrice,
                      StockItemNew,
                      requestQuantity,
                    }) => (
                      <tr key={id}>
                        <td style={{ minWidth: '214px' }}>
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
                            value={requestQuantity === 0 ? '' : requestQuantity}
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
                        <td style={{ maxWidth: '180px' }}>
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
                    <td className="text-end px-2 fw-bold">{purchaseTotal}</td>
                  </tr>
                  <tr key={1000} className="lastRows">
                    <td className="px-2 fw-bold" colSpan={5}>
                      Balance
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="editableTable" style={{ borderBlockStart: 'none' }}>
              <table>
                <thead>
                  <tr>
                    <th>Item name</th>
                    <th>unit</th>
                    <th>Qty</th>
                    <th>U.P</th>
                    <th>T.P</th>
                  </tr>
                </thead>
                <tbody>
                  {[...rowsReceive].map(
                    (
                      { id, unit, unitPrice, StockItemNew, receivedQuantity },
                      index,
                    ) => (
                      <tr key={id}>
                        <td style={{ minWidth: '214px' }}>
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
                            defaultValue={receivedQuantity}
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
                            defaultValue={
                              rowsPurchase[index].unitPrice === 0
                                ? ' '
                                : rowsPurchase[index].unitPrice
                            }
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
                              Number(unitPrice * receivedQuantity) === 0
                                ? ''
                                : Number(unitPrice * receivedQuantity)
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
                    <td className="text-end px-2 fw-bold">
                      {Math.round(receiveTotal)}
                    </td>
                  </tr>
                  <tr key={1000} className="lastRows">
                    <td className="px-2 fw-bold" colSpan={4} />

                    <td className="text-end px-2 fw-bold">
                      {Math.round(Balance)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <PrintFooterSignatures />
        <PrintFooterNoSignatures />
      </div>
    </div>
  )
})

export default ReceiveVaucherView
