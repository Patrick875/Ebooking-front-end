import { useSelector } from 'react-redux'

const PrintFooterNoSignatures = (props) => {
  const role = useSelector((state) => state.auth.role)
  const { firstName, lastName } = useSelector((state) => state.auth.user)
  return (
    <div className="mt-2 ms-3">
      <p>
        Printed by {firstName} {lastName}
      </p>
      <p>Printed on {new Date().toLocaleString()}</p>
    </div>
  )
}

export default PrintFooterNoSignatures
