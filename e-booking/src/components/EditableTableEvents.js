import ReactDatePicker from 'react-datepicker'
import '../scss/_editableTable.scss'

const EditableTableEvents = (props) => {
  let { data, setData, readOnly } = props

  const onChangeInput = (e, id) => {
    const { name, value } = e.target
    const editData = data.map((item) =>
      item.id === id && name ? { ...item, [name]: value } : item,
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

  return (
    <div className="editableTable">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>days</th>
            <th>U.P</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {[...data].map((el, i) => (
            <tr key={el.id}>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name="date"
                  value={el.date}
                  readOnly={readOnly}
                  type="text"
                  onChange={(e) => onChangeInput(e, el.id)}
                  placeholder=""
                />
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name="name"
                  value={el.name}
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
                  name="days"
                  type="number"
                  value={el.days === 0 ? ' ' : el.days}
                  readOnly={readOnly}
                  onChange={(e) => onChangeInput(e, el.id)}
                  placeholder=""
                />
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name={'price'}
                  type="text"
                  value={el.price ? el.price : el.price === 0 ? '' : el.price}
                  readOnly={readOnly}
                  onChange={(e) => onChangeInput(e, el.id)}
                  placeholder=""
                />
              </td>
              <td style={{ borderBottom: 'none' }}>
                <input
                  name="comment"
                  type="text"
                  value={el.comment}
                  onChange={(e) => onChangeInput(e, el.id)}
                  readOnly={readOnly}
                  placeholder=""
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EditableTableEvents
