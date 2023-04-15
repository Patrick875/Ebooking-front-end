import React from 'react'
import { CToast, CToastBody, CToaster, CToastHeader } from '@coreui/react'
function Notification({ activate, position, text, color }) {
  return (
    <CToaster push={activate} position={position}>
      <CToast autohide={false} visible={true} color={`${color}`}>
        <CToastHeader closeButton>
          <svg
            className="rounded me-2"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            role="img"
          >
            <rect width="100%" height="100%" fill="#007aff"></rect>
          </svg>
        </CToastHeader>
        <CToastBody>{text}</CToastBody>
      </CToast>
    </CToaster>
  )
}

export default Notification
