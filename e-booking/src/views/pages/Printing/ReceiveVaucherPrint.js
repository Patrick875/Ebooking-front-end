import { CImage, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import logo from '../../../assets/images/olympic_hotel_logo.png'
import PrintFooterSignatures from './PrintFooterSignatures'
import PrintFooterNoSignatures from './PrintFooterNoSignature'

const ReceiveVaucherPrint = React.forwardRef((props, ref) => {
  const { title } = props
  let [rowsPurchase] = useState(props.purchaseOrderItems)
  let [rowsReceive, setRowsReceive] = useState(props.purchaseOrderItems)
  const totalPurchases =
    rowsPurchase && rowsPurchase.length !== 0
      ? rowsPurchase.reduce((a, b) => a + b.unitPrice * b.requestQuantity, 0)
      : 0
  const totalReceiving =
    rowsReceive && rowsReceive.length !== 0
      ? rowsReceive.reduce((a, b) => a + b.unitPrice * b.requestQuantity, 0)
      : 0
  const Balance = totalPurchases - totalReceiving

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

  useEffect(() => {
    props.setData(rowsReceive)
  }, [rowsReceive])

  return (
    <div ref={ref}>
      <div className="m-3 p-3">
        <div className="d-flex flex-col my-3">
          <p className="col">
            Done on{' '}
            {new Date().toLocaleDateString() +
              ' at  ' +
              new Date().toLocaleTimeString()}
          </p>
          <p className="col">eBooking</p>
        </div>

        <CRow className="col d-flex flex-row">
          <div className="col-4">
            <CImage src={logo} fluid alt="olympic hotel logo" />
          </div>
          <div className="col">
            <p className="text-uppercase my-0 py-0">OLYMPIC HOTEL</p>
            <p className="my-0 py-0">TEL: +250 789 677 479/ +250 783 103 500</p>
            <p className="my-0 py-0">E-mail:info@olympichotel.rw</p>
            <p className="my-0 py-0">Website: www.olympichotel.rw</p>
            <p className="my-0 py-0">TIN/VAT: 102556009</p>
          </div>
        </CRow>
        <h5 className="text-center my-1 py-0 text-uppercase">{title}</h5>
        <div className="d-flex gap-0">
          <div className="col">
            <div>
              <p className="fw-bolder">Purchase order</p>
              <div className="editableTable">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
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
                          <td style={{ minWidth: '220px' }}>
                            <input
                              name="name"
                              value={StockItemNew.name}
                              readOnly={true}
                              type="text"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              style={{ maxWidth: '270px' }}
                              name="unit"
                              value={unit}
                              readOnly={true}
                              type="text"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              name="requestQuantity"
                              style={{ maxWidth: '110px' }}
                              value={
                                requestQuantity === 0 ? '' : requestQuantity
                              }
                              readOnly={true}
                              type="text"
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              name={'unitPrice'}
                              type="text"
                              value={unitPrice === 0 ? ' ' : unitPrice}
                              readOnly={true}
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              name="total"
                              type="text"
                              style={{ maxWidth: '180px' }}
                              value={
                                Number(unitPrice * requestQuantity).toFixed(
                                  2,
                                ) === 0
                                  ? ''
                                  : Number(unitPrice * requestQuantity).toFixed(
                                      2,
                                    )
                              }
                              readOnly={true}
                              placeholder=""
                            />
                          </td>
                        </tr>
                      ),
                    )}
                    <tr key={1000} className="lastRows">
                      <td className="fw-bold">Total</td>
                      <td className="px-2" />
                      <td className="px-2" />
                      <td className="px-2" />
                      <td className="text-end  fw-bold">{totalPurchases}</td>
                    </tr>
                    <tr key={1000} className="lastRows">
                      <td className="px-2 fw-bold" colSpan={5}>
                        Balance
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col">
            <div>
              <p className="fw-bolder">Received </p>
              <div
                className="editableTable"
                style={{ borderBlockStart: 'none' }}
              >
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>unit</th>
                      <th>Qty</th>
                      <th>U.P</th>
                      <th style={{ maxWidth: '180px' }}>T.P</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...rowsReceive].map(
                      (
                        { id, unit, unitPrice, StockItemNew, requestQuantity },
                        index,
                      ) => (
                        <tr key={id}>
                          <td>
                            <input
                              name="name"
                              value={StockItemNew.name}
                              readOnly={false}
                              style={{ minWidth: '220px' }}
                              type="text"
                              onChange={(e) => onChangeInput(e, id)}
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              name="unit"
                              value={unit}
                              readOnly={false}
                              type="text"
                              onChange={(e) => onChangeInput(e, id)}
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              name="requestQuantity"
                              defaultValue={requestQuantity}
                              style={{ maxWidth: '110px' }}
                              readOnly={false}
                              type="text"
                              onChange={(e) => onChangeInput(e, id)}
                              placeholder=""
                            />
                          </td>
                          <td>
                            <input
                              name={'unitPrice'}
                              style={{ width: 'auto-size' }}
                              type="text"
                              defaultValue={
                                rowsPurchase[index].unitPrice === 0
                                  ? ' '
                                  : rowsPurchase[index].unitPrice
                              }
                              readOnly={false}
                              onChange={(e) => onChangeInput(e, id)}
                              placeholder=""
                            />
                          </td>
                          <td style={{ maxWidth: '180px' }}>
                            <input
                              name="total"
                              type="text"
                              style={{ maxWidth: '180px' }}
                              value={
                                Number(unitPrice * requestQuantity).toFixed(
                                  2,
                                ) === 0
                                  ? ''
                                  : Number(unitPrice * requestQuantity).toFixed(
                                      2,
                                    )
                              }
                              onChange={(e) => onChangeInput(e, id)}
                              readOnly={false}
                              placeholder=""
                            />
                          </td>
                        </tr>
                      ),
                    )}
                    <tr key={1000} className="lastRows col">
                      <td className="fw-bold">Total</td>
                      <td className="px-2" />
                      <td className="px-2" />
                      <td className="px-2" />
                      <td className="text-end  fw-bold">
                        {Math.round(totalReceiving)}
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
        </div>

        <PrintFooterSignatures />
        <PrintFooterNoSignatures />
      </div>
    </div>
  )
})

export default ReceiveVaucherPrint
