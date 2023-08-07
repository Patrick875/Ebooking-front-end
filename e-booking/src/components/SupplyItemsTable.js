import React, { useEffect, useState } from 'react'
import { instance } from 'src/API/AxiosInstance'
import { units } from 'src/utils/constants'

const SupplyItemsTable = (props) => {
  const { data, setData } = props
  const [stores, setStores] = useState([])

  const onChangeInput = (e, id) => {
    const { name, value } = e.target

    const editData = data.map((item) =>
      item.id === id && name
        ? name === 'store'
          ? { ...item, storeId: value, item_id: '' }
          : { ...item, [name]: value }
        : item,
    )

    // If the selected item is from the current store, update its name in the data state.
    const currentItem = editData.find((item) => item.id === id)
    if (currentItem && currentItem.item_id) {
      const selectedStore = stores.find(
        (store) => store.id === currentItem.storeId,
      )
      const selectedItem = selectedStore.StockItemNews.find(
        (item) => item.id === currentItem.item_id,
      )
      if (selectedItem) {
        currentItem.name = selectedItem.name
      }
    }

    setData(editData)
  }

  const renderNameField = (el, i) => {
    const storeTouched = el.storeId !== ''
    const stockItemsForStore =
      stores && stores.length !== 0 && el.storeId !== ''
        ? stores
            .filter((store) => Number(el.storeId) === store.id)[0]
            .StockItemNews.map((el) => ({ id: el.id, name: el.name }))
        : []

    if (storeTouched) {
      return (
        <select
          placeholder=""
          name="name"
          value={el.name}
          onChange={(e) => onChangeInput(e, el.id)}
        >
          <option value="">Select an item</option>
          {stockItemsForStore.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      )
    } else {
      return (
        <input
          type="text"
          name="name"
          value={el.name}
          readOnly
          style={{ pointerEvents: 'none' }}
        />
      )
    }
  }

  useEffect(() => {
    const getAllStores = async () => {
      await instance.get('/stock/store/all').then((res) => {
        setStores(res.data.data)
        console.log('stores', res.data.data)
      })
    }
    getAllStores()
  }, [])

  return (
    <div className="editableTableReturn">
      <table>
        <thead>
          <tr>
            <th>Store</th>
            <th>Name</th>
            <th>Unit</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {[...data].map((el, i) => (
            <tr key={el.id}>
              <td>
                <select
                  placeholder=""
                  name="store"
                  value={el.storeId}
                  onChange={(e) => onChangeInput(e, el.id)}
                >
                  <option value="">Select a store</option>
                  {stores.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.name}
                    </option>
                  ))}
                </select>
              </td>
              <td style={{ borderBottom: 'none' }}>{renderNameField(el, i)}</td>
              <td style={{ borderBottom: 'none' }}>
                <select
                  disabled={el.storeId === ''}
                  placeholder=""
                  name="unit"
                  onChange={(e) => onChangeInput(e, el.id)}
                >
                  {el.storeId !== ''
                    ? units.map((el) => (
                        <option key={el.name} value={el.name}>
                          {el.symbol}
                        </option>
                      ))
                    : null}
                </select>
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name="quantity"
                  type="number"
                  step="any"
                  readOnly={el.storeId === ''}
                  defaultValue={el.quantity}
                  onChange={(e) => onChangeInput(e, el.id)}
                />
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name="price"
                  type="number"
                  step="any"
                  readOnly={el.storeId === ''}
                  defaultValue={el.price}
                  onChange={(e) => onChangeInput(e, el.id)}
                />
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name="total"
                  readOnly={el.storeId === ''}
                  value={Number(el.price * el.quantity).toLocaleString()}
                />
              </td>
            </tr>
          ))}
          <tr style={{ color: 'black' }}>
            <td>Total</td>
            <td colSpan={4} />
            <td>
              {Number(
                data
                  .filter((el) => el.quantity !== '' && el.price !== '')
                  .reduce((a, b) => a + Number(b.price * b.quantity), 0),
              ).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SupplyItemsTable
