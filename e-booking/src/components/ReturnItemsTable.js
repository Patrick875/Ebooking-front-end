import { useEffect, useState } from 'react'
import { instance } from 'src/API/AxiosInstance'
import { units } from 'src/utils/constants'

const ReturnItemsTable = (props) => {
  const { data, setData } = props
  let [stores, setStores] = useState([])

  const onChangeInput = (e, id) => {
    const { name, value } = e.target

    const editData = data.map((item) =>
      item.id === id && name
        ? name === 'store'
          ? { ...item, storeId: value }
          : name === 'name'
          ? { ...item, item_id: value }
          : { ...item, [name]: value }
        : item,
    )
    setData(editData)
  }
  useEffect(() => {
    const getAllStores = async () => {
      await instance.get('/stock/store/all').then((res) => {
        setStores(res.data.data)
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
            <th>price</th>
          </tr>
        </thead>
        <tbody>
          {[...data].map((el, i) => (
            <tr key={el.id}>
              <td>
                <select
                  placeholder=""
                  name="store"
                  onChange={(e) => onChangeInput(e, el.id)}
                >
                  {stores.map((el) => (
                    <option value={el.id}>{el.name}</option>
                  ))}
                </select>
              </td>
              <td style={{ borderBottom: 'none' }}>
                <select
                  disabled={el.storeId === ''}
                  placeholder=""
                  name="name"
                  onChange={(e) => onChangeInput(e, el.id)}
                >
                  {data[i].storeId !== ''
                    ? stores
                        .filter((store) => Number(el.storeId) === store.id)[0]
                        .StockItemNews.map((el) => (
                          <option value={el.id}>{el.name}</option>
                        ))
                    : null}
                </select>
              </td>
              <td style={{ borderBottom: 'none' }}>
                <select
                  disabled={el.storeId === ''}
                  placeholder=""
                  name="unit"
                  onChange={(e) => onChangeInput(e, el.id)}
                >
                  {data[i].storeId !== ''
                    ? units.map((el) => (
                        <option value={el.name}>{el.symbol}</option>
                      ))
                    : null}
                </select>
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name="quantity"
                  type="number"
                  step="any"
                  readOnly={data[i].storeId === ''}
                  defaultValue={el.quantity}
                  onChange={(e) => onChangeInput(e, el.id)}
                />
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name="price"
                  type="number"
                  step="any"
                  readOnly={data[i].storeId === ''}
                  defaultValue={el.price}
                  onChange={(e) => onChangeInput(e, el.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReturnItemsTable
