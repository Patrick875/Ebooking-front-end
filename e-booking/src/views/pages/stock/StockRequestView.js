import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import ReactToPrint from 'react-to-print'
import PrintHeader from '../Printing/PrintHeader'
import PrintFooterNoSignatures from '../Printing/PrintFooterNoSignature'
import { instance } from 'src/API/AxiosInstance'
import { toast } from 'react-hot-toast'
import BackButton from 'src/components/Navigating/BackButton'
import '../../../scss/_editableTable.scss'
import { initialRowsStockOrder } from 'src/utils/constants'
const StockRequestView = React.forwardRef((props, ref) => {
  const componentRef = useRef()
  let [stockOrderDetails] = useState([])
  const request = useSelector((state) => state.selection.selected)
  if (request && request.PetitStockRequesitionDetails) {
    stockOrderDetails = request.PetitStockRequesitionDetails
  }
  const [approved, setApproved] = useState(false)
  let [rows, setRows] = useState([
    ...stockOrderDetails,
    ...initialRowsStockOrder,
  ])
  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      sortable: false,
      valueGetter: (params) =>
        `${params.row.StockItemValue.StockItemNew.name || ''} `,
    },
    {
      field: 'quantity',
      headerName: 'Qty',
      sortable: false,
      hide: (params) => params.rowIndex === stockOrderDetails.length,
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      valueSetter: (params) => {
        const updateRow = {
          ...params.row,
          quantity: params.value,
        }
        let newRows = rows.map((item) =>
          item.StockItemValue.id === params.row.StockItemValue.id
            ? { ...params.row, quantity: Number(params.value) }
            : item,
        )
        setRows(newRows)
        return updateRow
      },
      editable: true,
    },
    {
      field: 'price',
      headerName: 'P.U',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      editable: true,
      hide: true,
      sortable: false,
      valueGetter: (params) => `${params.row.StockItemValue.price || ''} `,
      valueSetter: (params) => {
        const updatedRow = {
          ...params.row,
          StockItemValue: {
            ...params.row.StockItemValue,
            price: params.value,
          },
        }
        let newRows = rows.map((item) =>
          item.StockItemValue.id === params.row.StockItemValue.id
            ? {
                ...params.row,
                StockItemValue: {
                  ...params.row.StockItemValue,
                  price: Number(params.value),
                },
              }
            : item,
        )
        setRows(newRows)
        return updatedRow
      },
    },
    {
      field: 'total',
      headerName: 'T.P',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      sortable: false,
      valueGetter: (params) =>
        `${
          Number(params.row.quantity * params.row.StockItemValue.price) ||
          params.row.total
        } `,
    },
  ]
  const isLastRow = (params) => params.row.id === total.id
  const total = rows.reduce(
    (a, b) => a + b.StockItemValue.price * b.quantity,
    0,
  )

  const onChangeInput = (e, id) => {
    const { name, value } = e.target

    const editData = rows.map((item) =>
      item.id === id && name
        ? name === 'name'
          ? {
              ...item,
              StockItemValue: {
                ...item.StockItemValue,
                StockItemNew: {
                  ...item.StockItemValue.StockItemNew,
                  name: value,
                },
              },
            }
          : name === 'price'
          ? {
              ...item,
              StockItemValue: { ...item.StockItemValue, price: value },
            }
          : { ...item, [name]: value }
        : item,
    )

    setRows(editData)
  }
  const updateStockOrder = async (action) => {
    if (action === 'approve') {
      await instance
        .post(`petitstock/order/${action}`, {
          request: request.id,
          data: rows,
        })
        .then((res) => {
          setApproved(!approved)
        })
        .catch((err) => {
          toast.error(err.message)
        })
    } else if (action === 'cancel') {
      await instance
        .post('petitstock/order/cancel', {
          request: request.id,
        })
        .then(() => {
          toast.success('stock order canceled')
          setApproved(!approved)
        })
        .catch(() => {
          toast.error('error approving order')
        })
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <BackButton />
        <div className="d-flex justify-content-end">
          {stockOrderDetails && stockOrderDetails.length !== 0 ? (
            <ReactToPrint
              trigger={() => (
                <button className="btn btn-ghost-primary">Print</button>
              )}
              content={() => ref || componentRef.current}
            />
          ) : null}
          <button
            className={`btn btn-ghost-success text-black ${
              request.status === 'APPROVED' || request.status === 'CANCELED'
                ? 'disabled'
                : null
            }`}
            onClick={() => updateStockOrder('approve')}
          >
            Approve
          </button>
          <button
            className={`btn btn-ghost-danger text-black ${
              request.status === 'APPROVED' || request.status === 'CANCELED'
                ? 'disabled'
                : null
            }`}
            onClick={() => updateStockOrder('cancel')}
          >
            Cancel
          </button>
        </div>
      </div>

      <div>
        <div ref={ref || componentRef}>
          <PrintHeader />
          <div className="m-3 p-3">
            <p className="text-center my-1 text-uppercase fw-bold">
              Stock order N &#176; {request ? request.stockRequesitionId : null}
            </p>
            <div className="editableTable">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>U.P</th>
                    <th>T.P</th>
                  </tr>
                </thead>
                <tbody>
                  {[...rows].map(({ id, name, StockItemValue, quantity }) => (
                    <tr key={id}>
                      <td>
                        <input
                          name="name"
                          value={StockItemValue.StockItemNew.name}
                          readOnly={false}
                          type="text"
                          onChange={(e) => onChangeInput(e, id)}
                          placeholder=""
                        />
                      </td>
                      <td>
                        <input
                          name="quantity"
                          value={quantity === 0 ? '' : quantity}
                          readOnly={false}
                          type="text"
                          onChange={(e) => onChangeInput(e, id)}
                          placeholder=""
                        />
                      </td>
                      <td>
                        <input
                          name={'price'}
                          type="text"
                          value={
                            StockItemValue.price === 0
                              ? ' '
                              : StockItemValue.price
                          }
                          readOnly={false}
                          onChange={(e) => onChangeInput(e, id)}
                          placeholder=""
                        />
                      </td>
                      <td>
                        <input
                          name="total"
                          type="text"
                          value={
                            Number(StockItemValue.price * quantity) === 0
                              ? ''
                              : Number(StockItemValue.price * quantity)
                          }
                          onChange={(e) => onChangeInput(e, id)}
                          readOnly={false}
                          placeholder=""
                        />
                      </td>
                    </tr>
                  ))}
                  <tr key={1000} className="lastRows">
                    <td className="px-2 fw-bold">Total</td>
                    <td className="px-2" />
                    <td className="px-2" />
                    <td className="text-end px-2 fw-bold">{total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <PrintFooterNoSignatures />
        </div>
      </div>
    </div>
  )
})

export default StockRequestView
