import React from 'react'
import { CFooter } from '@coreui/react'
import ChatButton from './Chat/ChatButton'

const AppFooter = () => {
  const year = new Date().getFullYear()
  return (
    <CFooter>
      <div>
        <span className="ms-1">&copy; {year} Olympic Hotel by SANTech</span>
      </div>

      <ChatButton />
    </CFooter>
  )
}

export default React.memo(AppFooter)
