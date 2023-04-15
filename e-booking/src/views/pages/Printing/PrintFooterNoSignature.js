import { useSelector } from 'react-redux'

const PrintFooterNoSignatures = (props) => {
  const role = useSelector((state) => state.auth.role)
  const { firstName, lastName } = useSelector((state) => state.auth.user)
  return (
    <div className="mt-2">
      <p>
        Printed by <span className="fw-bold text-capitalize"> {role}</span>:{' '}
        {firstName} {lastName}
      </p>
    </div>
  )
}

export default PrintFooterNoSignatures
