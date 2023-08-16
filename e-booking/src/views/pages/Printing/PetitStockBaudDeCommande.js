import React from 'react'

function PetitStockBaudDeCommande(props) {
  const { user, orderItems, table, results, petitStock } = props
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <p className="my-0 py-0 ">OLYMPIC HOTEL</p>
      <p className="my-0 py-0 ">TEL:+250783103500 / 0789677479</p>

      <p>{new Date().toLocaleString()}</p>
      <p className="text-center my-1" style={{ fontSize: '14px' }}>
        <span style={{ fontSize: '10px' }}>BON DE COMMANDE/</span>
        {petitStock}
      </p>
      <table bordered>
        <thead>
          <th>#</th>
          <th> Item </th>
          <th> P.U </th>
          <th> Qty </th>
          <th> Total </th>
        </thead>
        <tbody>
          {orderItems && orderItems.length !== 0 ? (
            orderItems.map((item, index) => (
              <tr>
                <td scope="row">{index + 1}</td>
                <td className="px-1">{item.productName}</td>
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
        </tbody>
      </table>
      <p className="my-0">SERVED BY :{user} </p>
      <p className="mt-0 mb-1">Location :{table ? table : ''} </p>
      <p className="text-center my-0">*** ENJOY ! ***</p>
      <p className="text-center  my-0">MURAKOZE</p>
      <p className="text-center  my-0">
        ORDER DATE : {new Date().toLocaleDateString('fr-FR')}
      </p>
    </div>
  )
}

export default PetitStockBaudDeCommande
