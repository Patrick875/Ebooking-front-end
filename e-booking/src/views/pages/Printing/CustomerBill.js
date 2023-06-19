import React from 'react'

function CustomerBill(props) {
  const { user, orderItems, table, results, total } = props
  return (
    <div
      className="cool"
      style={{
        width: '100%',
        height: '100%',
        fontFamily: ' Arial, Helvetica, sans-serif',
      }}
    >
      <p className="my-0 py-0 ">MOMO Pay CODE : 005685 // OLYMPIC HOTEL </p>
      <p className="my-0 py-0 ">-------------------</p>
      <p className="my-0 py-0 ">OLYMPIC HOTEL</p>
      <p className="my-0 py-0 ">KIMIRONKO-KIGALI</p>
      <p className="my-0 py-0 ">TEL:+250783103500</p>
      <p className="my-0 py-0 ">TIN:102556009</p>
      <p>{new Date().toLocaleString()}</p>
      <p className="text-center my-1" style={{ fontSize: '10px' }}>
        {' '}
        CUSTOMER BILL{' '}
      </p>
      <table bordered>
        <thead>
          <th>#</th>
          <th> Item </th>
          <th> P.U </th>
          <th> Qty </th>
          <th> Amount </th>
        </thead>
        <tbody>
          {orderItems && orderItems.length !== 0 ? (
            orderItems.map((item, index) => (
              <tr>
                <td scope="row">{index + 1}</td>
                <td className="px-1">
                  {item.name + ' of ' + item.productName}
                </td>
                <td className="px-1">
                  {Number(item.ProductPackage.price).toLocaleString()}
                </td>
                <td className="px-1">{Number(results[index])}</td>
                <td>
                  {Number(
                    item.ProductPackage.price * results[index],
                  ).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>0 items on order</tr>
          )}
          <tr>
            <td />
            <td className="px-1" colSpan={3}>
              TOTAL
            </td>
            <td className="px-1">{total}</td>
          </tr>
        </tbody>
      </table>
      <p className="my-0">Served by :{user} </p>
      <p className="mt-0 mb-1">Location :{table ? table : ''} </p>
      <p className="text-center my-0"> NOT OFFICAL RECEIPT</p>
      <p className="text-center my-0">PLEASE WAIT FOR YOUR EBM</p>
      <p className="text-center  my-0"> MURAKOZE</p>
      <p className="text-center  my-0">-----------------</p>
    </div>
  )
}

export default CustomerBill
