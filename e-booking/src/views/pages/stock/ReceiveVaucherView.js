import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintHeader from '../Printing/PrintHeader'
import PrintFooterSignatures from '../Printing/PrintFooterSignatures'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import BackButton from 'src/components/Navigating/BackButton'
import { v4 as uuidv4 } from 'uuid'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'

const ReceiveVaucherView = React.forwardRef((props, ref) => {
  const vaucher = useSelector((state) => state.selection.selected)
  const componentRef = useRef()
  const [update, setUpdate] = useState(false)
  let [rowsPurchase] = useState(
    vaucher.StockPurchaseOrder.StockPurchaseOrderDetails,
  )
  let details =
    vaucher.StockReceiveVoucherDetails &&
    vaucher.StockReceiveVoucherDetails.length !== 0
      ? vaucher.StockReceiveVoucherDetails.map((el) => ({
          ...el,
          vid: uuidv4(),
        }))
      : vaucher.StockReceiveVoucherDetails
  let [rowsReceive, setRowsReceive] = useState(details)
  console.log('vaucher', vaucher)
  console.log('rows,received', rowsReceive)

  const receiveTotal = update
    ? rowsReceive.reduce(
        (acc, b) => acc + Number(b.receivedQuantity) * Number(b.unitPrice),
        0,
      )
    : vaucher && vaucher.StockReceiveVoucherDetails !== 0
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
      item.vid === id && name
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

  const updateVaucher = async () => {
    await instance
      .put('/receive/voucher/update', {
        details: rowsReceive,
        vaucherId: vaucher.id,
        total: rowsReceive.reduce(
          (acc, b) => acc + Number(b.receivedQuantity) * Number(b.unitPrice),
          0,
        ),
      })
      .then((res) => {
        if (res && res.data && Object.keys(res.data.data).length !== 0) {
          toast.success('updated successfull !!!')
          setUpdate(false)
        } else {
          toast.error(res.data.message)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }
  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        {update ? <p>...Updating</p> : null}
        <div className="col-9 d-flex justify-content-end gap-2">
          <button
            className="btn btn-success"
            onClick={() => {
              setUpdate(!update)
            }}
          >
            Update
          </button>
          {update ? (
            <button
              className="btn btn-success"
              onClick={() => {
                updateVaucher()
              }}
            >
              Submit pdate
            </button>
          ) : null}
          <ReactToPrint
            trigger={() => (
              <button className="btn btn-ghost-primary">Print</button>
            )}
            content={() => ref || componentRef.current}
          />
        </div>
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
                      {
                        vid,
                        id,
                        unit,
                        unitPrice,
                        StockItemNew,
                        receivedQuantity,
                      },
                      index,
                    ) => (
                      <tr key={id}>
                        <td style={{ minWidth: '214px' }}>
                          <input
                            name="name"
                            value={StockItemNew.name}
                            readOnly={!update}
                            type="text"
                            onChange={(e) => onChangeInput(e, vid)}
                            placeholder=""
                          />
                        </td>
                        <td>
                          <input
                            name="unit"
                            value={unit}
                            readOnly={!update}
                            type="text"
                            onChange={(e) => onChangeInput(e, vid)}
                            placeholder=""
                          />
                        </td>
                        <td>
                          <input
                            name="receivedQuantity"
                            defaultValue={receivedQuantity}
                            readOnly={!update}
                            type="text"
                            onChange={(e) => onChangeInput(e, vid)}
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
                            readOnly={!update}
                            onChange={(e) => onChangeInput(e, vid)}
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
                            onChange={(e) => onChangeInput(e, vid)}
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
