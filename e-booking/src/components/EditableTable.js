import '../scss/_editableTable.scss'

const EditableTable = (props) => {
  let { data, setData, readOnly, hidePrice, type } = props
  const priceHiden = hidePrice || false
  const onChangeInput = (e, id) => {
    const { name, value } = e.target

    const editData = data.map((item) =>
      item.id === id && name
        ? name === 'date'
          ? { ...item, [name]: new Date(value).toLocaleDateString() }
          : { ...item, [name]: value }
        : item,
    )

    setData(editData)
  }
  const orderTotal =
    data && data.length !== 0
      ? data.reduce((a, b) => a + Number(b.quantity * b.times * b.price), 0)
      : 0

  const orderTotalDelivery =
    data && data.length !== 0
      ? data.reduce((a, b) => a + Number(b.quantity * b.times * b.unitPrice), 0)
      : 0
  const amountVAT =
    type !== 'delivery'
      ? Number((orderTotal * 18) / 100)
      : Number((orderTotalDelivery * 18) / 100)
  const finalTotal =
    type !== 'delivery'
      ? Number(orderTotal + amountVAT)
      : Number(orderTotalDelivery + amountVAT)

  const totalRows = [
    {
      id: 3000,
      name: 'VALUE',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      requestQuantity: '',
      unitPrice: '',
      total: type !== 'delivery' ? orderTotal : orderTotalDelivery,
    },
    {
      id: 2000,
      name: 'VAT',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      requestQuantity: '',
      unitPrice: '',
      total: amountVAT,
    },
    {
      id: 1000,
      name: 'Total',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      requestQuantity: '',
      unitPrice: '',
      total: finalTotal,
    },
  ]

  return (
    <div className="editableTable">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Times</th>
            <th>U.P</th>
            <th>T.P</th>
          </tr>
        </thead>
        <tbody>
          {[...data].map(
            ({ id, name, description, quantity, times, price, unitPrice }) => (
              <tr key={id}>
                <td>
                  <input
                    name="name"
                    value={type !== 'delivery' ? name : description}
                    readOnly={readOnly}
                    type="text"
                    onChange={(e) => onChangeInput(e, id)}
                    placeholder=""
                  />
                </td>
                <td>
                  <input
                    name="quantity"
                    value={quantity === 0 ? '' : quantity}
                    readOnly={readOnly}
                    type="text"
                    onChange={(e) => onChangeInput(e, id)}
                    placeholder=""
                  />
                </td>
                <td>
                  <input
                    name="times"
                    type="text"
                    value={times === 0 ? ' ' : times}
                    readOnly={readOnly}
                    onChange={(e) => onChangeInput(e, id)}
                    placeholder=""
                  />
                </td>
                <td>
                  <input
                    name={type !== 'delivery' ? 'price' : 'unitPrice'}
                    type="text"
                    value={
                      priceHiden && (price || unitPrice)
                        ? 0
                        : (price || unitPrice) === 0
                        ? ''
                        : price || unitPrice
                    }
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
                      priceHiden && (price || unitPrice)
                        ? 0
                        : Number(price * quantity * times) === 0
                        ? ''
                        : price
                        ? Number(price * quantity * times)
                        : Number(unitPrice * quantity * times) === 0
                        ? ''
                        : Number(unitPrice * quantity * times)
                    }
                    onChange={(e) => onChangeInput(e, id)}
                    readOnly={readOnly}
                    placeholder=""
                  />
                </td>
              </tr>
            ),
          )}
          {totalRows.map(({ id, name, total }) => (
            <tr key={id} className="lastRows">
              <td colSpan={4}>
                {
                  <input
                    name="name"
                    value={name}
                    type="text"
                    readOnly={readOnly}
                  />
                }
              </td>

              <td>
                <input
                  name="total"
                  type="text"
                  value={hidePrice ? 0 : Number(total)}
                  onChange={(e) => onChangeInput(e, id)}
                  placeholder=""
                  readOnly={readOnly}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EditableTable
