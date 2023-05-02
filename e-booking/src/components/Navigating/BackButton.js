import { CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { IoReturnUpBack } from 'react-icons/io5'

export default function BackButton() {
  const navigate = useNavigate()

  return (
    <CButton onClick={() => navigate(-1)}>
      <IoReturnUpBack /> Back
    </CButton>
  )
}
