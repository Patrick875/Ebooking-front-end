import '../scss/_editableTable.scss'

const EditableTableWithDates = (props) => {
  let { data, setData, readOnly, hidePrice, type } = props
  const priceHiden = hidePrice || false
  const onChangeInput = (e, id) => {
    const { name, value } = e.target
    const editData = data.map((item) =>
      item.id === id && name
        ? name === 'description' && type === 'delivery'
          ? { ...item, [name]: value, name: value }
          : { ...item, [name]: value }
        : item,
    )

    setData(editData)
  }
  const onChangeInputDate = (date, id) => {
    const editData = data.map((item) =>
      item.id === id ? { ...item, date: date } : item,
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
      ? Number((orderTotal * 18) / 118)
      : Number((orderTotalDelivery * 18) / 118)
  const finalTotal =
    type !== 'delivery'
      ? Number(orderTotal - amountVAT)
      : Number(orderTotalDelivery - amountVAT)

  const totalRows = [
    {
      id: 2000,
      name: 'VALUE',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      requestQuantity: '',
      unitPrice: '',
      total: Math.round(finalTotal),
    },
    {
      id: 2000,
      name: 'VAT',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      requestQuantity: '',
      unitPrice: '',
      total: Math.round(amountVAT),
    },
    {
      id: 3000,
      name: 'TOTAL',
      flex: 1,
      minWidth: 200,
      maxWidth: 300,
      requestQuantity: '',
      unitPrice: '',
      total:
        type !== 'delivery'
          ? Math.round(orderTotal)
          : Math.round(orderTotalDelivery),
    },
  ]
  return (
    <div className="editableTable">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Times</th>
            <th>U.P</th>
            <th>T.P</th>
          </tr>
        </thead>
        <tbody>
          {[...data].map((el, i) => (
            <tr key={el.id}>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name={'date'}
                  value={el.date}
                  readOnly={readOnly}
                  type="text"
                  onChange={(e) => onChangeInput(e, el.id)}
                  placeholder=""
                />
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name={type === 'delivery' ? 'description' : 'name'}
                  value={type !== 'delivery' ? el.name : el.description}
                  readOnly={readOnly}
                  type="text"
                  onChange={(e) => onChangeInput(e, el.id)}
                  placeholder=""
                />
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name="quantity"
                  value={el.quantity === 0 ? '' : el.quantity}
                  readOnly={readOnly}
                  type="text"
                  onChange={(e) => onChangeInput(e, el.id)}
                  placeholder=""
                />
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name="times"
                  type="text"
                  value={el.times === 0 ? ' ' : el.times}
                  readOnly={readOnly}
                  onChange={(e) => onChangeInput(e, el.id)}
                  placeholder=""
                />
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name={type !== 'delivery' ? 'price' : 'unitPrice'}
                  type="text"
                  value={
                    priceHiden && (el.price || el.unitPrice)
                      ? 0
                      : (el.price || el.unitPrice) === 0
                      ? ''
                      : el.price || el.unitPrice
                  }
                  readOnly={readOnly}
                  onChange={(e) => onChangeInput(e, el.id)}
                  placeholder=""
                />
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name="total"
                  type="text"
                  value={
                    priceHiden && (el.price || el.unitPrice)
                      ? 0
                      : Number(el.price * el.quantity * el.times) === 0
                      ? ''
                      : el.price
                      ? Number(
                          el.price * el.quantity * el.times,
                        ).toLocaleString()
                      : Number(el.unitPrice * el.quantity * el.times) === 0
                      ? ''
                      : Number(
                          el.unitPrice * el.quantity * el.times,
                        ).toLocaleString()
                  }
                  onChange={(e) => onChangeInput(e, el.id)}
                  readOnly={readOnly}
                  placeholder=""
                />
              </td>
            </tr>
          ))}
          {totalRows.map(({ id, name, total }, index) => (
            <tr key={id} className="lastRows">
              <td
                colSpan={5}
                className={`${
                  index === totalRows.length - 1 ? 'fw-bold' : ''
                } `}
              >
                {
                  <input
                    className={`${
                      index === totalRows.length - 1 ? 'fw-bold' : ''
                    } `}
                    name="name"
                    value={name}
                    type="text"
                    readOnly={readOnly}
                  />
                }
              </td>

              <td colSpan={5}>
                <input
                  name="total"
                  type="text"
                  className={`${
                    index === totalRows.length - 1 ? 'fw-bold' : ''
                  } `}
                  value={hidePrice ? 0 : Number(total).toLocaleString()}
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

export default EditableTableWithDates
